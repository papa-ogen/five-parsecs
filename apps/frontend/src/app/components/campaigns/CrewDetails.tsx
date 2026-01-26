import { DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Progress, Space, Statistic } from 'antd';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

import CrewItems from './CrewItems';
import PendingItemRolls from './PendingItemRolls';

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
          {crew.debt > 0 && (
            <Statistic 
              title="Debt" 
              value={crew.debt} 
              prefix={<DollarCircleOutlined />}
              formatter={(value) => <span style={{ color: '#ff4d4f' }}>{value}</span>}
            />
          )}
          <Statistic title="Reputation" value={crew.reputation} />
          <Statistic title="Patrons" value={crew.patrons} />
          <Statistic title="Rivals" value={crew.rivals} />
          <Statistic title="Quest Rumors" value={crew.questRumors} />
          <Statistic title="Rumors" value={crew.rumors} />
        </Space>

        {crew.ship && (
          <Card size="small" title="🚀 Ship Information" type="inner">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Ship Name">{crew.ship.name}</Descriptions.Item>
              <Descriptions.Item label="Ship Type">{crew.ship.description}</Descriptions.Item>
              <Descriptions.Item label="Hull">
                <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                  {(() => {
                    // For now, current hull equals max hull (no damage tracking yet)
                    // This can be updated to use crew.ship.currentHull when damage is implemented
                    const currentHull = crew.ship.hull;
                    const maxHull = crew.ship.hull;
                    const hullPercent = (currentHull / maxHull) * 100;
                    
                    // Color based on hull percentage
                    let strokeColor = '#52c41a'; // Green
                    if (hullPercent <= 30) {
                      strokeColor = '#ff4d4f'; // Red
                    } else if (hullPercent <= 60) {
                      strokeColor = '#faad14'; // Orange/Yellow
                    }
                    
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 500 }}>
                            {currentHull} / {maxHull}
                          </span>
                          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {hullPercent.toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          percent={hullPercent}
                          strokeColor={strokeColor}
                          showInfo={false}
                          size={{ width: 200 }}
                          style={{ marginTop: 4 }}
                        />
                      </>
                    );
                  })()}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {crew.location && (
          <div>
            <strong>Location:</strong> {crew.location}
          </div>
        )}

        <PendingItemRolls crew={crew} />
        <CrewItems crew={crew} />
      </Space>
    </Card>
  );
}

export default CrewDetails;
