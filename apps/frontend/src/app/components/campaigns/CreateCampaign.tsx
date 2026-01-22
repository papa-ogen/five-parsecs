import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, message } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';

import type { CampaignFormData } from './campaignSchema';
import CreateCampaignModal from './CreateCampaignModal';

export function CreateCampaign() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CampaignFormData) => {
      // Generate campaign data with required fields
      const campaignData = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        crewId: '', // Will be created separately
        campaignTurn: 0,
        credits: 1000, // Starting credits
        storyPoints: 0,
        enabledModuleIds: ['core'], // Start with core module
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return api.campaigns.create(campaignData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      message.success('Campaign created successfully!');
      setModalOpen(false);
    },
    onError: (error) => {
      message.error(`Failed to create campaign: ${error.message}`);
    },
  });

  const handleCreateCampaign = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = async (values: CampaignFormData) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        onClick={handleCreateCampaign}
      >
        Create New Campaign
      </Button>

      <CreateCampaignModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}

export default CreateCampaign;
