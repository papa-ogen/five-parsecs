import {
  CrownOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ICampaignCharacter } from '@five-parsecs/parsec-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  App,
  Avatar,
  Button,
  Card,
  Empty,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

import CreateCrewMemberModal, {
  type CrewMemberData,
} from './CreateCrewMemberModal';
import ViewCrewMemberModal from './ViewCrewMemberModal';

const { Title, Text } = Typography;

export function Crew() {
  const { selectedCampaign } = useCampaign();
  const [modalOpen, setModalOpen] = useState(false);
  const [leaderModalOpen, setLeaderModalOpen] = useState(false);
  const [selectedCharacterForLeader, setSelectedCharacterForLeader] =
    useState<ICampaignCharacter | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCharacterForView, setSelectedCharacterForView] =
    useState<ICampaignCharacter | null>(null);
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

  // Fetch all species for displaying species names
  const { data: allSpecies } = useQuery({
    queryKey: ['species'],
    queryFn: api.species.getAll,
  });

  // Fetch all weapons for displaying weapon names (equipped, etc.)
  const { data: allWeapons } = useQuery({
    queryKey: ['weapons'],
    queryFn: () => api.items.getAllWeapons(),
  });

  // Fetch all gear and gadgets for displaying names (equipped, etc.)
  const { data: allGear } = useQuery({
    queryKey: ['gear'],
    queryFn: () => api.items.getAllGear(),
  });
  const { data: allGadgets } = useQuery({
    queryKey: ['gadgets'],
    queryFn: () => api.items.getAllGadgets(),
  });

  // Helper function to get species name by ID
  const getSpeciesName = (speciesId: string) => {
    const species = allSpecies?.find((s) => s.id === speciesId);
    return species?.name || 'Unknown';
  };

  // Helper function to get weapon name by ID
  const getWeaponName = (weaponId: string) => {
    const weapon = allWeapons?.find((w) => w.id === weaponId);
    return weapon?.name ?? weaponId;
  };

  // Helper to get full weapon by ID (for unequipping back to crew pool)
  const getWeapon = (weaponId: string) =>
    allWeapons?.find((w) => w.id === weaponId);

  const getGearName = (gearId: string) => {
    const gear = allGear?.find((g) => g.id === gearId);
    return gear?.name ?? gearId;
  };
  const getGear = (gearId: string) => allGear?.find((g) => g.id === gearId);

  const getGadgetName = (gadgetId: string) => {
    const gadget = allGadgets?.find((g) => g.id === gadgetId);
    return gadget?.name ?? gadgetId;
  };
  const getGadget = (gadgetId: string) =>
    allGadgets?.find((g) => g.id === gadgetId);

  const createCharacterMutation = useMutation({
    mutationFn: (data: Partial<ICampaignCharacter>) =>
      api.campaignCharacters.create(data),
    onSuccess: (newCharacter) => {
      // Invalidate campaign characters
      queryClient.invalidateQueries({ queryKey: ['campaignCharacters'] });

      // Invalidate campaign crew (because characterIds array and resources are updated)
      queryClient.invalidateQueries({
        queryKey: ['campaignCrew', selectedCampaign?.crewId],
      });

      // Invalidate campaigns (because story points may be added)
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });

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

  const updateCharacterMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ICampaignCharacter>;
    }) => api.campaignCharacters.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignCharacters'] });
      message.success('Leader selected successfully!');
      setLeaderModalOpen(false);
      setSelectedCharacterForLeader(null);
    },
    onError: (error) => {
      console.error('Failed to update character:', error);
      message.error('Failed to select leader');
    },
  });

  if (!selectedCampaign || !crew) {
    return null;
  }

  // Filter characters for this campaign's crew
  const crewMembers =
    allCharacters?.filter((char) => char.crewId === selectedCampaign.crewId) ||
    [];

  const handleCreateCrew = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleCreateMember = (data: CrewMemberData) => {
    // Map crew type to species ID
    // Crew Type IDs: 1=Baseline Human, 2=Primary Alien, 3=Bot, 4=Strange Character
    let speciesId = '1'; // Default to human

    if (data.crewType?.id === '3') {
      speciesId = '29'; // Bot
    } else if (data.crewType?.id === '1') {
      speciesId = '1'; // Baseline Human
    }
    // TODO: Add logic for Primary Alien and Strange Character

    // Create crew member with all rolled data
    // Backend will calculate stats based on species abilities and effects
    const characterData: Partial<ICampaignCharacter> = {
      name: data.name,
      crewId: selectedCampaign.crewId,
      speciesId: speciesId,
      backgroundId: data.background?.id || '',
      motivationId: data.motivation?.id || '',
      characterClassId: data.characterClass?.id || '',
      isInjured: false,
      injuries: [],
      weapons: [],
      armor: [],
      gear: [],
      isActive: true,
      isDead: false,
      isLeader: false,
    };

    createCharacterMutation.mutate(characterData);
  };

  const handleSelectLeader = (character: ICampaignCharacter) => {
    setSelectedCharacterForLeader(character);
    setLeaderModalOpen(true);
  };

  const handleConfirmLeader = () => {
    if (!selectedCharacterForLeader) return;

    // Bots (speciesId "29") don't receive luck bonus
    const isBot = selectedCharacterForLeader.speciesId === '29';
    const luckBonus = isBot ? 0 : 1;

    updateCharacterMutation.mutate({
      id: selectedCharacterForLeader.id,
      data: {
        isLeader: true,
        luck: selectedCharacterForLeader.luck + luckBonus,
      },
    });
  };

  if (isLoading) {
    return (
      <Card style={{ width: '100%', textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </Card>
    );
  }

  const hasCrewMembers = crewMembers.length > 0;
  const isCrewFull = crewMembers.length >= 6;
  const hasLeader = crewMembers.some((char) => char.isLeader);

  if (hasCrewMembers) {
    return (
      <Card
        title={
          <Space>
            <TeamOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Crew Members ({crewMembers.length}/6)
            </Title>
          </Space>
        }
        extra={
          <Tooltip
            title={isCrewFull ? 'Maximum crew size reached (6 members)' : ''}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateCrew}
              disabled={isCrewFull}
            >
              Add Member
            </Button>
          </Tooltip>
        }
        style={{ width: '100%' }}
      >
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          {crewMembers.map((character) => (
            <Card key={character.id} size="small">
              <Card.Meta
                avatar={
                  <Avatar
                    size={48}
                    style={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <Space>
                    <Text strong>{character.name}</Text>
                    {character.isLeader && (
                      <Tag color="gold" icon={<CrownOutlined />}>
                        Leader
                      </Tag>
                    )}
                    <Tag color="purple">
                      {getSpeciesName(character.speciesId)}
                    </Tag>
                    {character.isDead && <Tag color="red">Dead</Tag>}
                    {character.isInjured && <Tag color="orange">Injured</Tag>}
                    {!character.isActive && <Tag color="default">Inactive</Tag>}
                  </Space>
                }
                description={
                  <Space
                    orientation="horizontal"
                    size="small"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <Space orientation="vertical" size="small">
                      <Space size="small" wrap>
                        <Tag>XP: {character.xp}</Tag>
                      </Space>
                    </Space>
                    <Space size="small" wrap>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Reactions: {character.reactions} | Speed:{' '}
                        {character.speed} | Combat: {character.combat} |
                        Toughness: {character.toughness} | Savvy:{' '}
                        {character.savvy}{' '}
                        {character.luck > 0 ? `| Luck: ${character.luck}` : ''}
                      </Text>
                    </Space>
                    <Space size="small" wrap>
                      <Button
                        key="view"
                        type="link"
                        onClick={() => {
                          setSelectedCharacterForView(character);
                          setViewModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                      {!hasLeader && !character.isLeader && (
                        <Button
                          key="leader"
                          type="link"
                          icon={<CrownOutlined />}
                          onClick={() => handleSelectLeader(character)}
                        >
                          Select Leader
                        </Button>
                      )}
                    </Space>
                  </Space>
                }
              />
            </Card>
          ))}
        </Space>

        <CreateCrewMemberModal
          open={modalOpen}
          onClose={handleModalClose}
          onSubmit={handleCreateMember}
        />

        <ViewCrewMemberModal
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedCharacterForView(null);
          }}
          character={
            selectedCharacterForView
              ? (allCharacters?.find(
                  (c) => c.id === selectedCharacterForView.id
                ) ?? selectedCharacterForView)
              : null
          }
          crew={crew ?? null}
          getSpeciesName={getSpeciesName}
          getWeaponName={getWeaponName}
          getWeapon={getWeapon}
          getGearName={getGearName}
          getGear={getGear}
          getGadgetName={getGadgetName}
          getGadget={getGadget}
        />

        <Modal
          title={
            <Space>
              <CrownOutlined style={{ color: '#faad14' }} />
              <span>Confirm Leader Selection</span>
            </Space>
          }
          open={leaderModalOpen}
          onCancel={() => {
            setLeaderModalOpen(false);
            setSelectedCharacterForLeader(null);
          }}
          onOk={handleConfirmLeader}
          okText="Confirm"
          okButtonProps={{ danger: true }}
        >
          <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            <Text>
              Are you sure you want to make{' '}
              <Text strong>{selectedCharacterForLeader?.name}</Text> the crew
              leader?
            </Text>
            <Text type="warning" strong>
              ⚠️ This decision cannot be changed later!
            </Text>
            {selectedCharacterForLeader?.speciesId === '29' ? (
              <Text type="secondary">
                The selected character will be designated as the crew leader.
                <br />
                <Text type="secondary" italic>
                  Note: Bots do not receive the +1 Luck bonus when selected as
                  leader.
                </Text>
              </Text>
            ) : (
              <Text type="secondary">
                The selected character will receive +1 Luck and will be
                designated as the crew leader.
              </Text>
            )}
          </Space>
        </Modal>
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
          <Space orientation="vertical">
            <Text type="secondary">
              No crew members yet. Create your crew to start your adventure!
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              You'll generate 6 crew members by rolling their characteristics.
            </Text>
          </Space>
        }
      >
        <Tooltip
          title={isCrewFull ? 'Maximum crew size reached (6 members)' : ''}
        >
          <Button
            type="primary"
            size="large"
            onClick={handleCreateCrew}
            disabled={isCrewFull}
          >
            <PlusOutlined /> Add Crew Member
          </Button>
        </Tooltip>
      </Empty>

      <CreateCrewMemberModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateMember}
      />

      <Modal
        title={
          <Space>
            <CrownOutlined style={{ color: '#faad14' }} />
            <span>Confirm Leader Selection</span>
          </Space>
        }
        open={leaderModalOpen}
        onCancel={() => {
          setLeaderModalOpen(false);
          setSelectedCharacterForLeader(null);
        }}
        onOk={handleConfirmLeader}
        okText="Confirm"
        okButtonProps={{ danger: true }}
      >
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Text>
            Are you sure you want to make{' '}
            <Text strong>{selectedCharacterForLeader?.name}</Text> the crew
            leader?
          </Text>
          <Text type="warning" strong>
            ⚠️ This decision cannot be changed later!
          </Text>
          {selectedCharacterForLeader?.speciesId === '29' ? (
            <Text type="secondary">
              The selected character will be designated as the crew leader.
              <br />
              <Text type="secondary" italic>
                Note: Bots do not receive the +1 Luck bonus when selected as
                leader.
              </Text>
            </Text>
          ) : (
            <Text type="secondary">
              The selected character will receive +1 Luck and will be designated
              as the crew leader.
            </Text>
          )}
        </Space>
      </Modal>
    </Card>
  );
}

export default Crew;
