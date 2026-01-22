import { CampaignStatus } from '@five-parsecs/parsec-api';
import { Badge, Card, Descriptions, Space, Statistic, Tag } from 'antd';

import { useCampaign } from '../../contexts/AppContext';

function getStatusRibbon(status: CampaignStatus) {
  switch (status) {
    case CampaignStatus.NO_STARTED:
      return { text: 'Not Started', color: 'cyan' };
    case CampaignStatus.IN_PROGRESS:
      return { text: 'In Progress', color: 'blue' };
    case CampaignStatus.COMPLETED:
      return { text: 'Completed', color: 'green' };
    case CampaignStatus.ABANDONED:
      return { text: 'Abandoned', color: 'red' };
    default:
      return { text: 'Unknown', color: 'default' };
  }
}

export function CampaignDetails() {
  const { selectedCampaign } = useCampaign();

  if (!selectedCampaign) {
    return (
      <Card title="Campaign">
        <p style={{ color: '#999' }}>No campaign selected. Please select a campaign above.</p>
      </Card>
    );
  }

  const ribbon = getStatusRibbon(selectedCampaign.status);

  return (
    <Badge.Ribbon text={ribbon.text} color={ribbon.color}>
      <Card title={selectedCampaign.name}>
      <Space orientation="vertical" style={{ width: '100%' }} size="large">
        {selectedCampaign.description && (
          <div>
            <strong>Description:</strong> {selectedCampaign.description}
          </div>
        )}

        <Space size="large" wrap>
          <Statistic title="Turn" value={selectedCampaign.campaignTurn} />
          <Statistic title="Credits" value={selectedCampaign.credits} prefix="¤" />
          <Statistic title="Story Points" value={selectedCampaign.storyPoints} />
        </Space>

        {selectedCampaign.shipName && (
          <Card size="small" title="🚀 Ship Information" type="inner">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Ship Name">{selectedCampaign.shipName}</Descriptions.Item>
              {selectedCampaign.shipType && (
                <Descriptions.Item label="Ship Type">{selectedCampaign.shipType}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}

        <div>
          <strong>Active Modules:</strong>
          <div style={{ marginTop: '8px' }}>
            <Space size={4} wrap>
              {selectedCampaign.enabledModuleIds.map((moduleId) => (
                <Tag key={moduleId} color="blue">
                  {moduleId}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      </Space>
    </Card>
    </Badge.Ribbon>
  );
}

export default CampaignDetails;
