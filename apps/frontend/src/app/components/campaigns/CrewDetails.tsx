import { DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Space, Statistic } from 'antd';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

export function CrewDetails() {
  const { selectedCampaign } = useCampaign();

  // Fetch crew data for the selected campaign
  const { data: crew } = useQuery({
    queryKey: ['campaignCrew', selectedCampaign?.crewId],
    queryFn: () => api.campaignCrews.getById(selectedCampaign!.crewId),
    enabled: !!selectedCampaign?.crewId,
  });

  if (!selectedCampaign || !crew) {
    return null;
  }

  return (
    <Card 
      title={
        <Space>
          <TeamOutlined />
          <span>{crew.name}</span>
        </Space>
      }
    >
      <Space orientation="vertical" style={{ width: '100%' }} size="large">
        {crew.description && (
          <div>
            <strong>Description:</strong> {crew.description}
          </div>
        )}

        <Space size="large" wrap>
          <Statistic title="Credits" value={crew.credits} prefix={<DollarCircleOutlined />} />
          <Statistic title="Reputation" value={crew.reputation} />
          <Statistic title="Patrons" value={crew.patrons} />
          <Statistic title="Rivals" value={crew.rivals} />
        </Space>

        {crew.shipName && (
          <Card size="small" title="🚀 Ship Information" type="inner">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Ship Name">{crew.shipName}</Descriptions.Item>
              {crew.shipType && (
                <Descriptions.Item label="Ship Type">{crew.shipType}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}

        {crew.location && (
          <div>
            <strong>Location:</strong> {crew.location}
          </div>
        )}
      </Space>
    </Card>
  );
}

export default CrewDetails;
