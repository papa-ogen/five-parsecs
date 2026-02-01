import { PlusOutlined } from '@ant-design/icons';
import { CampaignStatus } from '@five-parsecs/parsec-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, Button } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

import type { CampaignFormData } from './campaignSchema';
import CreateCampaignModal from './CreateCampaignModal';

export function CreateCampaign() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { setSelectedCampaignId } = useCampaign();
  const { message } = App.useApp();

  const createMutation = useMutation({
    mutationFn: (data: CampaignFormData) => {
      // Generate campaign data with required fields
      const campaignData = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        status: CampaignStatus.NO_STARTED, // Initial status
        crewId: '', // Will be created automatically by backend
        crewSize: data.crewSize,
        crewCompositionMethod: data.crewCompositionMethod,
        campaignTurn: 0,
        storyPoints: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return api.campaigns.create(campaignData);
    },
    onSuccess: (newCampaign) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // Automatically select the newly created campaign by ID
      setSelectedCampaignId(newCampaign.id);
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
