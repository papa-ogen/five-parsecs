import { useQuery } from '@tanstack/react-query';
import { Alert, Card, List, Spin } from 'antd';

import { api } from '../../../services/api';

export function Campaigns() {
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: api.campaigns.getAll,
  });

  if (isLoading) {
    return (
      <Card title="Campaigns">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Campaigns">
        <Alert
          message="Error"
          description={error instanceof Error ? error.message : 'Failed to load campaigns'}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card title="Campaigns">
      {campaigns && campaigns.length > 0 ? (
        <List
          dataSource={campaigns}
          renderItem={(campaign) => (
            <List.Item key={campaign.id}>
              <List.Item.Meta
                title={campaign.name}
                description={campaign.description || 'No description'}
              />
            </List.Item>
          )}
        />
      ) : (
        <p>No campaigns yet. Create your first campaign to get started!</p>
      )}
    </Card>
  );
}

export default Campaigns;
