import type {
  ICampaignCrew,
  IGadget,
  IGear,
  IWeapon,
} from '@five-parsecs/parsec-api';
import { Card, Space, Tag, Typography } from 'antd';

const { Title, Text } = Typography;

interface CrewItemsProps {
  crew: ICampaignCrew;
}

export function CrewItems({ crew }: CrewItemsProps) {
  const hasItems =
    (crew.gadgets && crew.gadgets.length > 0) ||
    (crew.gear && crew.gear.length > 0) ||
    (crew.weapons && crew.weapons.length > 0);

  if (!hasItems) {
    return null;
  }

  const renderItem = (item: IGadget | IGear | IWeapon) => (
    <div
      style={{
        padding: '8px 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Space orientation="vertical" size="small" style={{ width: '100%' }}>
        <Text strong>{item.name}</Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.description}
        </Text>
      </Space>
    </div>
  );

  return (
    <Card size="small" title="📦 Crew Items" type="inner">
      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        {crew.gadgets && crew.gadgets.length > 0 && (
          <div>
            <Title level={5}>Gadgets ({crew.gadgets.length})</Title>
            <div>
              {crew.gadgets.map((item, index) => (
                <div key={`${item.id}-${index}`}>
                  {renderItem(item as IGadget)}
                </div>
              ))}
            </div>
          </div>
        )}

        {crew.gear && crew.gear.length > 0 && (
          <div>
            <Title level={5}>Gear ({crew.gear.length})</Title>
            <div>
              {crew.gear.map((item, index) => (
                <div key={`${item.id}-${index}`}>
                  {renderItem(item as IGear)}
                </div>
              ))}
            </div>
          </div>
        )}

        {crew.weapons && crew.weapons.length > 0 && (
          <div>
            <Title level={5}>Weapons ({crew.weapons.length})</Title>
            <div>
              {crew.weapons.map((item, index) => {
                const weapon = item as IWeapon;
                return (
                  <div
                    key={`${weapon.id}-${index}`}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Space
                      orientation="vertical"
                      size="small"
                      style={{ width: '100%' }}
                    >
                      <Space>
                        <Tag
                          color={
                            weapon.type === 'military'
                              ? 'red'
                              : weapon.type === 'highTech'
                              ? 'blue'
                              : 'default'
                          }
                        >
                          {weapon.type}
                        </Tag>
                        <Text strong>{weapon.name}</Text>
                      </Space>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {weapon.description}
                      </Text>
                    </Space>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
}

export default CrewItems;
