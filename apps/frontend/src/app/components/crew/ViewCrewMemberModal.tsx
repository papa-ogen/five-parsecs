import { CrownOutlined, UserOutlined } from '@ant-design/icons';
import type { ICampaignCharacter } from '@five-parsecs/parsec-api';
import { Avatar, Descriptions, Modal, Space, Table, Tag, Typography } from 'antd';

const { Text } = Typography;

interface ViewCrewMemberModalProps {
  open: boolean;
  onClose: () => void;
  character: ICampaignCharacter | null;
  getSpeciesName: (speciesId: string) => string;
}

export function ViewCrewMemberModal({
  open,
  onClose,
  character,
  getSpeciesName,
}: ViewCrewMemberModalProps) {
  if (!character) {
    return null;
  }

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
