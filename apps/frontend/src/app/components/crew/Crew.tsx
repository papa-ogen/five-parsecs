import { PlusOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { ICampaignCharacter } from '@five-parsecs/parsec-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Empty, List, Space, Spin, Tag, Typography } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

import CreateCrewMemberModal, { type CrewMemberData } from './CreateCrewMemberModal';

const { Title, Text } = Typography;

export function Crew() {
  const { selectedCampaign } = useCampaign();
  const [modalOpen, setModalOpen] = useState(false);
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  // Fetch crew data for the selected campaign
  const { data: crew } = useQuery({
    queryKey: ['campaignCrew', selectedCampaign?.crewId],
    queryFn: () => api.campaignCrews.getById(selectedCampaign!.crewId),
    enabled: !!selectedCampaign?.crewId,
  });

  // Fetch all campaign characters
  const { data: allCharacters, isLoading } = useQuery({
    queryKey: ['campaignCharacters'],
    queryFn: api.campaignCharacters.getAll,
  });

  const createCharacterMutation = useMutation({
    mutationFn: (data: Partial<ICampaignCharacter>) => api.campaignCharacters.create(data),
    onSuccess: (newCharacter) => {
      // Invalidate campaign characters
      queryClient.invalidateQueries({ queryKey: ['campaignCharacters'] });
      
      // Invalidate campaign crew (because characterIds array is updated)
      queryClient.invalidateQueries({ queryKey: ['campaignCrew', selectedCampaign?.crewId] });
      
      // Optionally update cache directly for instant feedback
      queryClient.setQueryData<ICampaignCharacter[]>(
        ['campaignCharacters'],
        (old) => (old ? [...old, newCharacter] : [newCharacter])
      );
      
      message.success('Crew member created successfully!');
      setModalOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create crew member:', error);
      message.error('Failed to create crew member');
    },
  });

  if (!selectedCampaign || !crew) {
    return null;
  }

  // Only show crew setup for campaigns that have a ship
  if (!crew.shipName) {
    return null;
  }

  // Filter characters for this campaign's crew
  const crewMembers = allCharacters?.filter(
    (char) => char.crewId === selectedCampaign.crewId
  ) || [];

  const handleCreateCrew = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleCreateMember = (data: CrewMemberData) => {
    // Map crew type to species ID
    // Crew Type IDs: 1=Baseline Human, 2=Primary Alien, 3=Bot, 4=Strange Character
    // For now, use crew type ID as species ID (they should match in the data model)
    const speciesId = data.crewType?.id || '1';
    
    // Create crew member with all rolled data
    const characterData: Partial<ICampaignCharacter> = {
      name: data.name,
      crewId: selectedCampaign.crewId,
      speciesId: speciesId,
      backgroundId: data.background?.id || '1',
      motivationId: data.motivation?.id || '',
      characterClassId: data.characterClass?.id || '',
      talentIds: [],
      reactions: 1,
      speed: 4,
      combat: 0,
      toughness: 3,
      savvy: 0,
      xp: 0,
      level: 1,
      isInjured: false,
      injuries: [],
      weapons: [],
      armor: [],
      gear: [],
      isActive: true,
      isDead: false,
      isLeader: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createCharacterMutation.mutate(characterData);
  };

  if (isLoading) {
    return (
      <Card style={{ width: '100%', textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </Card>
    );
  }

  const hasCrewMembers = crewMembers.length > 0;

  if (hasCrewMembers) {
    return (
      <Card
        title={
          <Space>
            <TeamOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Crew Members ({crewMembers.length})
            </Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCrew}>
            Add Member
          </Button>
        }
        style={{ width: '100%' }}
      >
        <List
          itemLayout="horizontal"
          dataSource={crewMembers}
          renderItem={(character) => (
            <List.Item
              actions={[
                <Button key="view" type="link">
                  View
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                    }}
                  >
                    <UserOutlined />
                  </div>
                }
                title={
                  <Space>
                    <Text strong>{character.name}</Text>
                    {character.isDead && <Tag color="red">Dead</Tag>}
                    {character.isInjured && <Tag color="orange">Injured</Tag>}
                    {!character.isActive && <Tag color="default">Inactive</Tag>}
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small">
                    <Space size="small" wrap>
                      <Tag>Level {character.level}</Tag>
                      <Tag>XP: {character.xp}</Tag>
                    </Space>
                    <Space size="small" wrap>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Reactions: {character.reactions} | Speed: {character.speed} | 
                        Combat: {character.combat} | Toughness: {character.toughness} | 
                        Savvy: {character.savvy}
                      </Text>
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
        
        <CreateCrewMemberModal
          open={modalOpen}
          onClose={handleModalClose}
          onSubmit={handleCreateMember}
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <TeamOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Crew Setup
          </Title>
        </Space>
      }
      style={{ width: '100%' }}
    >
      <Empty
        image={<TeamOutlined style={{ fontSize: 48, color: '#1890ff' }} />}
        description={
          <Space direction="vertical">
            <Text type="secondary">
              No crew members yet. Create your crew to start your adventure!
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              You'll generate 6 crew members by rolling their characteristics.
            </Text>
          </Space>
        }
      >
        <Button type="primary" size="large" onClick={handleCreateCrew}>
          <PlusOutlined /> Add Crew Member
        </Button>
      </Empty>

      <CreateCrewMemberModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateMember}
      />
    </Card>
  );
}

export default Crew;
