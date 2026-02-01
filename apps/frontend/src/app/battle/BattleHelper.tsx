import { useQuery } from '@tanstack/react-query';
import { Card, List, Select, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { api } from '../../services/api';
import { useCampaign, useSettings } from '../contexts/AppContext';

import BattleCrewMemberItem from './BattleCrewMemberItem';
import { formatLength } from './unitConversion';

const BattleHelper = () => {
  const { selectedCampaign } = useCampaign();
  const { unitSystem } = useSettings();
  const [selectedBattleSizeId, setSelectedBattleSizeId] = useState<string | null>(null);

  const { data: battleSizes } = useQuery({
    queryKey: ['battleSizes'],
    queryFn: () => api.battleSizes.getAll(),
  });

  const { data: allCharacters } = useQuery({
    queryKey: ['campaignCharacters'],
    queryFn: api.campaignCharacters.getAll,
  });

  const { data: allWeapons } = useQuery({
    queryKey: ['weapons'],
    queryFn: () => api.items.getAllWeapons(),
  });
  const { data: allGear } = useQuery({
    queryKey: ['gear'],
    queryFn: () => api.items.getAllGear(),
  });
  const { data: allGadgets } = useQuery({
    queryKey: ['gadgets'],
    queryFn: () => api.items.getAllGadgets(),
  });

  const getWeapon = (id: string) => allWeapons?.find((w) => w.id === id);
  const getGearName = (id: string) => allGear?.find((g) => g.id === id)?.name ?? id;
  const getGadgetName = (id: string) => allGadgets?.find((g) => g.id === id)?.name ?? id;

  const selectedBattleSize =
    battleSizes?.find((b) => b.id === selectedBattleSizeId) ?? battleSizes?.[0] ?? null;

  useEffect(() => {
    if (battleSizes?.length && selectedBattleSizeId === null) {
      setSelectedBattleSizeId(battleSizes[0].id);
    }
  }, [battleSizes, selectedBattleSizeId]);


  const crewMembers =
    selectedCampaign?.crewId && allCharacters
      ? allCharacters.filter((c) => c.crewId === selectedCampaign.crewId)
      : [];

  const battleSizeDisplay = selectedBattleSize
    ? formatLength(selectedBattleSize.value, unitSystem)
    : null;

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space wrap align="center" size="middle">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Battle Helper
          </Typography.Title>
          <Space align="center" size="small">
            <Typography.Text type="secondary">Battle size</Typography.Text>
            <Select<string>
              value={selectedBattleSizeId ?? undefined}
              onChange={setSelectedBattleSizeId}
              options={
                battleSizes?.map((b) => {
                  const { value, unit } = formatLength(b.value, unitSystem);
                  return { value: b.id, label: `${value} ${unit}` };
                }) ?? []
              }
              style={{ minWidth: 100 }}
              loading={!battleSizes}
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
              <BattleCrewMemberItem
                member={member}
                getWeapon={getWeapon}
                getGearName={getGearName}
                getGadgetName={getGadgetName}
              />
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
            Size:{' '}
            {battleSizeDisplay
              ? `${battleSizeDisplay.value} ${battleSizeDisplay.unit}`
              : '—'}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Inches to cm
          </Typography.Text>
          <Table
            size="small"
            pagination={false}
            dataSource={[4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 24].map((inches) => ({
              key: inches,
              inches,
              cm: (inches * 2.54).toFixed(1),
            }))}
            columns={[
              { title: 'Inches', dataIndex: 'inches', key: 'inches', width: 80 },
              { title: 'cm', dataIndex: 'cm', key: 'cm', width: 80 },
            ]}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default BattleHelper;