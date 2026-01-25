import { CampaignStatus } from '@five-parsecs/parsec-api';
import { Badge, Card, Space, Statistic } from 'antd';

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
      <Card title={`Campaign Details - ${selectedCampaign.name}`}>
        <Space orientation="horizontal" style={{ width: '100%' }} size="large">
          {selectedCampaign.description && (
            <div>
              <strong>Description:</strong> {selectedCampaign.description}
            </div>
          )}

          <Space size="large" wrap>
            <Statistic title="Turn" value={selectedCampaign.campaignTurn} />
            <Statistic title="Story Points" value={selectedCampaign.storyPoints} />
          </Space>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
}

export default CampaignDetails;
