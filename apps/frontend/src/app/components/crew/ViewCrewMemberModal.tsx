import { CrownOutlined, UserOutlined } from '@ant-design/icons';
import type { ICampaignCharacter, ICampaignCrew, IWeapon } from '@five-parsecs/parsec-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, Avatar, Descriptions, Modal, Select, Space, Table, Tag, Typography } from 'antd';

import { api } from '../../../services/api';

const { Text } = Typography;

interface ViewCrewMemberModalProps {
  open: boolean;
  onClose: () => void;
  character: ICampaignCharacter | null;
  crew: ICampaignCrew | null;
  getSpeciesName: (speciesId: string) => string;
  getWeaponName: (weaponId: string) => string;
  getWeapon: (weaponId: string) => IWeapon | undefined;
}

export function ViewCrewMemberModal({
  open,
  onClose,
  character,
  crew,
  getSpeciesName,
  getWeaponName,
  getWeapon,
}: ViewCrewMemberModalProps) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const unequipWeaponMutation = useMutation({
    mutationFn: async ({
      weaponId,
      equippedIndex,
    }: {
      weaponId: string;
      equippedIndex: number;
    }) => {
      if (!character || !crew) return;
      const weapon = getWeapon(weaponId);
      if (!weapon) throw new Error('Weapon not found');
      const newCharacterWeapons = (character.weapons || []).filter(
        (_, i) => i !== equippedIndex
      );
      const newCrewWeapons = [...crew.weapons, weapon];
      await api.campaignCharacters.update(character.id, {
        weapons: newCharacterWeapons,
      });
      await api.campaignCrews.update(crew.id, { weapons: newCrewWeapons });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignCharacters'] });
      queryClient.invalidateQueries({ queryKey: ['campaignCrew', crew?.id] });
      message.success('Weapon unequipped');
    },
    onError: () => {
      message.error('Failed to unequip weapon');
    },
  });

  const assignWeaponMutation = useMutation({
    mutationFn: async ({
      weaponIndex,
      weapon,
    }: {
      weaponIndex: number;
      weapon: IWeapon;
    }) => {
      if (!character || !crew) return;
      const newCharacterWeapons = [...(character.weapons || []), weapon.id];
      const newCrewWeapons = crew.weapons.filter((_, i) => i !== weaponIndex);
      await api.campaignCharacters.update(character.id, { weapons: newCharacterWeapons });
      await api.campaignCrews.update(crew.id, { weapons: newCrewWeapons });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignCharacters'] });
      queryClient.invalidateQueries({ queryKey: ['campaignCrew', crew?.id] });
      message.success('Weapon equipped');
    },
    onError: () => {
      message.error('Failed to equip weapon');
    },
  });

  if (!character) {
    return null;
  }

  const availableWeapons = crew?.weapons ?? [];
  const equippedWeaponIds = character.weapons ?? [];

  return (
    <Modal
      title={
        <Space>
          <Avatar
            size={32}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
            icon={<UserOutlined />}
          />
          <span>{character.name}</span>
          {character.isLeader && (
            <Tag color="gold" icon={<CrownOutlined />}>
              Leader
            </Tag>
          )}
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
    >
      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        <Space size="small" wrap>
          <Tag color="purple">{getSpeciesName(character.speciesId)}</Tag>
          {character.isDead && <Tag color="red">Dead</Tag>}
          {character.isInjured && <Tag color="orange">Injured</Tag>}
          {!character.isActive && <Tag color="default">Inactive</Tag>}
        </Space>

        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="XP">{character.xp}</Descriptions.Item>
        </Descriptions>

        <Table
          size="small"
          pagination={false}
          columns={[
            { title: 'Reactions', dataIndex: 'reactions', key: 'reactions' },
            { title: 'Speed', dataIndex: 'speed', key: 'speed' },
            { title: 'Combat', dataIndex: 'combat', key: 'combat' },
            { title: 'Toughness', dataIndex: 'toughness', key: 'toughness' },
            { title: 'Savvy', dataIndex: 'savvy', key: 'savvy' },
            { title: 'Luck', dataIndex: 'luck', key: 'luck' },
          ]}
          dataSource={[
            {
              key: 'stats',
              reactions: character.reactions,
              speed: character.speed,
              combat: character.combat,
              toughness: character.toughness,
              savvy: character.savvy,
              luck: character.luck,
            },
          ]}
        />

        <div>
          <Text strong>Weapons</Text>
          <div style={{ marginTop: 4 }}>
            {equippedWeaponIds.length > 0 ? (
              <Space size="small" wrap>
                {equippedWeaponIds.map((id, index) => (
                  <Tag
                    key={`${id}-${index}`}
                    closable={!unequipWeaponMutation.isPending}
                    onClose={() =>
                      !unequipWeaponMutation.isPending &&
                      unequipWeaponMutation.mutate({
                        weaponId: id,
                        equippedIndex: index,
                      })
                    }
                  >
                    {getWeaponName(id)}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">None equipped</Text>
            )}
          </div>
          {availableWeapons.length > 0 && (
            <Select<number>
              key={`weapon-select-${availableWeapons.length}`}
              placeholder="Equip from crew pool"
              style={{ width: '100%', marginTop: 8 }}
              value={undefined}
              onChange={(index: number) => {
                if (index == null) return;
                const weapon = availableWeapons[index];
                if (weapon) {
                  assignWeaponMutation.mutate({ weaponIndex: index, weapon });
                }
              }}
              options={availableWeapons.map((w, i) => ({
                value: i,
                label: w.name,
              }))}
              loading={assignWeaponMutation.isPending}
            />
          )}
        </div>

        {character.injuries && character.injuries.length > 0 && (
          <div>
            <Text strong>Injuries</Text>
            <div>
              <Text type="secondary">{character.injuries.join(', ')}</Text>
            </div>
          </div>
        )}
      </Space>
    </Modal>
  );
}

export default ViewCrewMemberModal;
