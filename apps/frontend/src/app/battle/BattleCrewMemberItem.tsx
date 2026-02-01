import { CrownOutlined, UserOutlined } from '@ant-design/icons';
import type { ICampaignCharacter, IWeapon } from '@five-parsecs/parsec-api';
import { List, Space, Tag, Tooltip, Typography } from 'antd';

interface BattleCrewMemberItemProps {
  member: ICampaignCharacter;
  getWeapon: (id: string) => IWeapon | undefined;
  getGearName: (id: string) => string;
  getGadgetName: (id: string) => string;
}

function weaponStatsLabel(weapon: IWeapon): string {
  return `Rng:${weapon.range} Sh:${weapon.shots} Dmg:${weapon.damage}`;
}

export function BattleCrewMemberItem({
  member,
  getWeapon,
  getGearName,
  getGadgetName,
}: BattleCrewMemberItemProps) {
  const weapons = member.weapons ?? [];
  const gear = member.gear ?? [];
  const gadgets = member.gadgets ?? [];
  const hasEquipment = weapons.length > 0 || gear.length > 0 || gadgets.length > 0;

  return (
    <List.Item>
      <Space orientation="vertical" size={4} style={{ width: '100%' }}>
        <Space>
          <UserOutlined />
          <Typography.Text>{member.name}</Typography.Text>
          {member.isLeader && (
            <Tag color="gold" icon={<CrownOutlined />}>
              Leader
            </Tag>
          )}
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            R:{member.reactions} S:{member.speed} C:{member.combat} T:{member.toughness} Sa:{member.savvy} L:{member.luck}
          </Typography.Text>
        </Space>
        {hasEquipment && (
          <Space wrap size={[4, 4]} style={{ marginLeft: 24 }}>
            {weapons.length > 0 && (
              <>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Weapons:
                </Typography.Text>
                {weapons.map((id, i) => {
                  const weapon = getWeapon(id);
                  const name = weapon?.name ?? id;
                  const stats = weapon ? weaponStatsLabel(weapon) : null;
                  return (
                    <Tooltip
                      key={`w-${id}-${i}`}
                      title={stats ? `${name} — ${stats}` : name}
                    >
                      <Tag style={{ margin: 0 }}>
                        {name}
                        {stats && (
                          <Typography.Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                            ({stats})
                          </Typography.Text>
                        )}
                        {weapon?.traits?.length ? (
                          <Typography.Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                            {weapon.traits.join(', ')}
                          </Typography.Text>
                        ) : null}
                      </Tag>
                    </Tooltip>
                  );
                })}
              </>
            )}
            {gear.length > 0 && (
              <>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Gear:
                </Typography.Text>
                {gear.map((id, i) => (
                  <Tag key={`g-${id}-${i}`} style={{ margin: 0 }}>
                    {getGearName(id)}
                  </Tag>
                ))}
              </>
            )}
            {gadgets.length > 0 && (
              <>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Gadgets:
                </Typography.Text>
                {gadgets.map((id, i) => (
                  <Tag key={`d-${id}-${i}`} style={{ margin: 0 }}>
                    {getGadgetName(id)}
                  </Tag>
                ))}
              </>
            )}
          </Space>
        )}
      </Space>
    </List.Item>
  );
}

export default BattleCrewMemberItem;
