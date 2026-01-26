import type { ICampaignCrew, IGadget, IGear, IWeapon } from '@five-parsecs/parsec-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, message, Space } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';

import PendingItemRoll from './PendingItemRoll';
import RollItemModal, { type ItemType } from './RollItemModal';

interface PendingItemRollsProps {
  crew: ICampaignCrew;
}

export function PendingItemRolls({ crew }: PendingItemRollsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const queryClient = useQueryClient();

  const updateCrewMutation = useMutation({
    mutationFn: (data: Partial<ICampaignCrew>) => api.campaignCrews.update(crew.id, data),
    onSuccess: () => {
      // Invalidate crew cache to refresh the data
      queryClient.invalidateQueries({ queryKey: ['campaignCrew', crew.id] });
      // Also invalidate campaigns in case story points or other data changed
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  const hasPendingItems =
    crew.gadgetCount > 0 ||
    crew.gearCount > 0 ||
    crew.lowTechWeaponCount > 0 ||
    crew.militaryWeaponCount > 0 ||
    crew.highTechWeaponCount > 0;

  if (!hasPendingItems) {
    return null;
  }

  const handleRoll = (itemType: ItemType, count: number) => {
    setSelectedItemType(itemType);
    setSelectedCount(count);
    setModalOpen(true);
  };

  const handleConfirm = (rolledItems: (IGadget | IGear | IWeapon)[]) => {
    if (rolledItems.length === 0 || !selectedItemType) {
      return;
    }

    // Prepare the update based on item type
    const updateData: Partial<ICampaignCrew> = {};

    switch (selectedItemType) {
      case 'gadgets': {
        const gadgets = rolledItems as IGadget[];
        updateData.gadgets = [...(crew.gadgets || []), ...gadgets];
        updateData.gadgetCount = Math.max(0, crew.gadgetCount - rolledItems.length);
        break;
      }
      case 'gear': {
        const gear = rolledItems as IGear[];
        updateData.gear = [...(crew.gear || []), ...gear];
        updateData.gearCount = Math.max(0, crew.gearCount - rolledItems.length);
        break;
      }
      case 'lowTechWeapons': {
        const weapons = rolledItems as IWeapon[];
        updateData.weapons = [...(crew.weapons || []), ...weapons];
        updateData.lowTechWeaponCount = Math.max(0, crew.lowTechWeaponCount - rolledItems.length);
        break;
      }
      case 'militaryWeapons': {
        const weapons = rolledItems as IWeapon[];
        updateData.weapons = [...(crew.weapons || []), ...weapons];
        updateData.militaryWeaponCount = Math.max(0, crew.militaryWeaponCount - rolledItems.length);
        break;
      }
      case 'highTechWeapons': {
        const weapons = rolledItems as IWeapon[];
        updateData.weapons = [...(crew.weapons || []), ...weapons];
        updateData.highTechWeaponCount = Math.max(0, crew.highTechWeaponCount - rolledItems.length);
        break;
      }
    }

    // Update the crew
    updateCrewMutation.mutate(updateData, {
      onSuccess: () => {
        message.success(`Successfully added ${rolledItems.length} item(s) to crew!`);
        // Close modal and reset state
        setModalOpen(false);
        setSelectedItemType(null);
        setSelectedCount(0);
      },
      onError: (error) => {
        message.error(`Failed to save items: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Keep modal open so user can try again
      },
    });
  };

  return (
    <>
      <Card size="small" title="📦 Pending Item Rolls" type="inner">
        <Space size="large" wrap>
          <PendingItemRoll
            title="Gadgets"
            count={crew.gadgetCount}
            onRoll={() => handleRoll('gadgets', crew.gadgetCount)}
          />
          <PendingItemRoll
            title="Gear"
            count={crew.gearCount}
            onRoll={() => handleRoll('gear', crew.gearCount)}
          />
          <PendingItemRoll
            title="Low-Tech Weapons"
            count={crew.lowTechWeaponCount}
            onRoll={() => handleRoll('lowTechWeapons', crew.lowTechWeaponCount)}
          />
          <PendingItemRoll
            title="Military Weapons"
            count={crew.militaryWeaponCount}
            onRoll={() => handleRoll('militaryWeapons', crew.militaryWeaponCount)}
          />
          <PendingItemRoll
            title="High-Tech Weapons"
            count={crew.highTechWeaponCount}
            onRoll={() => handleRoll('highTechWeapons', crew.highTechWeaponCount)}
          />
        </Space>
      </Card>

      {selectedItemType && (
        <RollItemModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedItemType(null);
            setSelectedCount(0);
          }}
          itemType={selectedItemType}
          count={selectedCount}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

export default PendingItemRolls;
