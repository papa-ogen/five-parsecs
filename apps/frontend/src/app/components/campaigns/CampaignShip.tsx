import { RocketOutlined } from '@ant-design/icons';
import { CampaignStatus, ICampaign } from '@five-parsecs/parsec-api';
import type { IShipType } from '@five-parsecs/parsec-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Empty } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

import ShipGeneratorModal from './ShipGeneratorModal';

export function CampaignShip() {
  const { selectedCampaign, setSelectedCampaign } = useCampaign();
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const updateCampaignMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICampaign> }) =>
      api.campaigns.update(id, data),
    onSuccess: (updatedCampaign) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // Update the selected campaign with the new ship data
      setSelectedCampaign(updatedCampaign);
      message.success('Ship configured successfully!');
    },
  });

  if (!selectedCampaign) {
    return null;
  }

  // Only show ship setup for campaigns that haven't started AND don't have a ship yet
  if (selectedCampaign.status !== CampaignStatus.NO_STARTED || selectedCampaign.shipName) {
    return null;
  }

  const handleSetupShip = () => {
    setModalOpen(true);
  };

  const handleConfirmShip = (ship: IShipType, shipName: string) => {
    updateCampaignMutation.mutate({
      id: selectedCampaign.id,
      data: {
        shipName: shipName,
        shipType: ship.id,
        updatedAt: new Date().toISOString(),
      },
    });
    setModalOpen(false);
  };

  return (
    <>
      <Card title="Ship Setup" extra={<RocketOutlined style={{ fontSize: '20px' }} />}>
        <Empty
          description="No ship configured yet. Set up your ship to begin your journey!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" size="large" onClick={handleSetupShip}>
            Setup Ship
          </Button>
        </Empty>
      </Card>

      <ShipGeneratorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmShip}
      />
    </>
  );
}

export default CampaignShip;
