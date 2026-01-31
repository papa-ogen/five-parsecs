import { RocketOutlined } from '@ant-design/icons';
import { CampaignStatus, ICampaignCrew } from '@five-parsecs/parsec-api';
import type { IShipType } from '@five-parsecs/parsec-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Empty } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

import ShipGeneratorModal from './ShipGeneratorModal';

export function CampaignShip() {
  const { selectedCampaign } = useCampaign();
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Fetch crew data for the selected campaign
  const { data: crew } = useQuery({
    queryKey: ['campaignCrew', selectedCampaign?.crewId],
    queryFn: () => api.campaignCrews.getById(selectedCampaign!.crewId),
    enabled: !!selectedCampaign?.crewId,
  });

  const updateCrewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICampaignCrew> }) =>
      api.campaignCrews.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignCrew'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      message.success('Ship configured successfully!');
    },
  });

  if (!selectedCampaign || !crew) {
    return null;
  }

  // Require full crew (6 members) and no pending item rolls before ship setup
  const hasFullCrew = (crew.characterIds?.length || 0) >= 6;
  const noPendingRolls =
    crew.gadgetCount === 0 &&
    crew.gearCount === 0 &&
    crew.lowTechWeaponCount === 0 &&
    crew.militaryWeaponCount === 0 &&
    crew.highTechWeaponCount === 0;

  if (!hasFullCrew || !noPendingRolls) {
    return null;
  }

  // Only show ship setup for campaigns that haven't started AND don't have a ship yet
  if (selectedCampaign.status !== CampaignStatus.NO_STARTED || crew.ship) {
    return null;
  }

  const handleSetupShip = () => {
    setModalOpen(true);
  };

  const handleConfirmShip = (ship: IShipType, shipName: string) => {
    updateCrewMutation.mutate({
      id: crew.id,
      data: {
        ship: {
          ...ship,
          name: shipName, // Override the ship type's name with the custom name
        },
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
