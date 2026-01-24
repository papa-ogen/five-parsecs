import { useQuery } from '@tanstack/react-query';
import { Alert, Select, Space, Spin } from 'antd';
import { useEffect } from 'react';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

export function Campaigns() {
  const { selectedCampaignId, setSelectedCampaignId, setSelectedCampaign } = useCampaign();

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: api.campaigns.getAll,
  });

  // Single effect: Update selectedCampaign based on selectedCampaignId
  useEffect(() => {
    if (selectedCampaignId && campaigns) {
      const campaign = campaigns.find((c) => c.id === selectedCampaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
      } else {
        setSelectedCampaign(null);
      }
    } else {
      setSelectedCampaign(null);
    }
  }, [selectedCampaignId, campaigns, setSelectedCampaign]);

  if (isLoading) {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
    );
  }

  if (error) {
    return (
        <Alert
          message="Error"
          description={error instanceof Error ? error.message : 'Failed to load campaigns'}
          type="error"
          showIcon
        />
    );
  }

  return (
    <>
      {campaigns && campaigns.length > 0 ? (
        <Space orientation="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Campaign
            </label>
            <Select
              style={{ width: '200px' }}
              placeholder="Select a campaign"
              value={selectedCampaignId}
              onChange={setSelectedCampaignId}
              options={campaigns.map((campaign) => ({
                label: campaign.name,
                value: campaign.id,
              }))}
            />
          </div>

        </Space>
      ) : (
        <p>No campaigns yet. Create your first campaign to get started!</p>
      )}
    </>
  );
}

export default Campaigns;
