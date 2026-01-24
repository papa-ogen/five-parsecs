import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { App, Button, Card, Empty, Space, Typography } from 'antd';
import { useState } from 'react';

import { useCampaign } from '../../contexts/AppContext';

import CreateCrewMemberModal from './CreateCrewMemberModal';

const { Title, Text } = Typography;

export function Crew() {
  const { selectedCampaign } = useCampaign();
  const [modalOpen, setModalOpen] = useState(false);
  const { message } = App.useApp();

  if (!selectedCampaign) {
    return null;
  }

  // Only show crew setup for campaigns that have a ship
  if (!selectedCampaign.shipName) {
    return null;
  }

  const handleCreateCrew = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleCreateMember = (name: string) => {
    // TODO: Create crew member via API
    message.success(`Crew member "${name}" created!`);
    setModalOpen(false);
  };

  // TODO: Check if crew already exists
  const hasCrewMembers = false;

  if (hasCrewMembers) {
    return (
      <Card
        title={
          <Space>
            <TeamOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Crew Members
            </Title>
          </Space>
        }
        style={{ width: '100%' }}
      >
        <Text>Crew members will be displayed here</Text>
        {/* TODO: Display crew members */}
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
