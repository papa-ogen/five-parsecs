import { CrownOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Card, List, Select, Space, Tag, Typography } from 'antd';
import { useState } from 'react';

import { api } from '../../services/api';
import { useCampaign } from '../contexts/AppContext';

import { formatLength, type UnitSystem } from './unitConversion';

export type BattleSize = 2 | 2.5 | 3;
export type { UnitSystem } from './unitConversion';

const BATTLE_SIZE_OPTIONS = [
  { value: 2, label: '2' },
  { value: 2.5, label: '2.5' },
  { value: 3, label: '3' },
];

const UNIT_SYSTEM_OPTIONS = [
  { value: 'imperial', label: 'Imperial (ft)' },
  { value: 'metric', label: 'Metric (cm)' },
];

const BattleHelper = () => {
  const { selectedCampaign } = useCampaign();
  const [battleSize, setBattleSize] = useState<BattleSize>(2);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');

  const { data: allCharacters } = useQuery({
    queryKey: ['campaignCharacters'],
    queryFn: api.campaignCharacters.getAll,
  });

  const crewMembers =
    selectedCampaign?.crewId && allCharacters
      ? allCharacters.filter((c) => c.crewId === selectedCampaign.crewId)
      : [];

  const battleSizeDisplay = formatLength(battleSize, unitSystem);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space wrap align="center" size="middle">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Battle Helper
          </Typography.Title>
          <Space wrap align="center" size="middle">
            <Space align="center" size="small">
              <Typography.Text type="secondary">Unit system</Typography.Text>
              <Select<UnitSystem>
                value={unitSystem}
                onChange={setUnitSystem}
                options={UNIT_SYSTEM_OPTIONS}
                style={{ minWidth: 120 }}
              />
            </Space>
          </Space>
            <Space align="center" size="small">
              <Typography.Text type="secondary">Battle size</Typography.Text>
              <Select<BattleSize>
                value={battleSize}
                onChange={setBattleSize}
                options={BATTLE_SIZE_OPTIONS}
                style={{ minWidth: 80 }}
              />
            </Space>
        </Space>
      </Card>
      <Card title="Crew">
        {!selectedCampaign ? (
          <Typography.Text type="secondary">
            Select a campaign to see crew.
          </Typography.Text>
        ) : crewMembers.length === 0 ? (
          <Typography.Text type="secondary">No crew members.</Typography.Text>
        ) : (
          <List
            size="small"
            dataSource={crewMembers}
            renderItem={(member) => (
              <List.Item>
                <Space>
                  <UserOutlined />
                  <Typography.Text>{member.name}</Typography.Text>
                  {member.isLeader && (
                    <Tag color="gold" icon={<CrownOutlined />}>
                      Leader
                    </Tag>
                  )}
                </Space>
              </List.Item>
            )}
          />
        )}
      </Card>
      <Card title="Enemies">
        <Typography.Text type="secondary">List enemies (coming soon)</Typography.Text>
      </Card>
      <Card title="Battlefield">
        <Space orientation="vertical" size="small">
          <Typography.Text>
            Size: {battleSizeDisplay.value} {battleSizeDisplay.unit}
          </Typography.Text>
          <Typography.Text type="secondary">Setup (coming soon)</Typography.Text>
        </Space>
      </Card>
    </Space>
  );
};

export default BattleHelper;