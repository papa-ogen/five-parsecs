import type { IGadget, IGear, IWeapon } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { Button, List, Modal, Space, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { api } from '../../../services/api';

const { Title, Text } = Typography;

export type ItemType =
  | 'gadgets'
  | 'gear'
  | 'lowTechWeapons'
  | 'militaryWeapons'
  | 'highTechWeapons';

interface RollItemModalProps {
  open: boolean;
  onClose: () => void;
  itemType: ItemType;
  count: number;
  onConfirm: (rolledItems: (IGadget | IGear | IWeapon)[]) => void;
}

export function RollItemModal({
  open,
  onClose,
  itemType,
  count,
  onConfirm,
}: RollItemModalProps) {
  const [rolledItems, setRolledItems] = useState<(IGadget | IGear | IWeapon)[]>(
    []
  );
  const [isRolling, setIsRolling] = useState(false);

  // Reset rolled items when modal closes
  useEffect(() => {
    if (!open) {
      setRolledItems([]);
      setIsRolling(false);
    }
  }, [open]);

  // Fetch items based on type
  const { data: gadgets, isLoading: isLoadingGadgets } = useQuery({
    queryKey: ['gadgets'],
    queryFn: () => api.items.getAllGadgets(),
    enabled: open && itemType === 'gadgets',
  });

  const { data: gear, isLoading: isLoadingGear } = useQuery({
    queryKey: ['gear'],
    queryFn: () => api.items.getAllGear(),
    enabled: open && itemType === 'gear',
  });

  const { data: lowTechWeapons, isLoading: isLoadingLowTech } = useQuery({
    queryKey: ['weapons', 'lowTech'],
    queryFn: () => api.items.getAllWeapons('lowTech'),
    enabled: open && itemType === 'lowTechWeapons',
  });

  const { data: militaryWeapons, isLoading: isLoadingMilitary } = useQuery({
    queryKey: ['weapons', 'military'],
    queryFn: () => api.items.getAllWeapons('military'),
    enabled: open && itemType === 'militaryWeapons',
  });

  const { data: highTechWeapons, isLoading: isLoadingHighTech } = useQuery({
    queryKey: ['weapons', 'highTech'],
    queryFn: () => api.items.getAllWeapons('highTech'),
    enabled: open && itemType === 'highTechWeapons',
  });

  const getAvailableItems = (): (IGadget | IGear | IWeapon)[] => {
    switch (itemType) {
      case 'gadgets':
        return gadgets || [];
      case 'gear':
        return gear || [];
      case 'lowTechWeapons':
        return lowTechWeapons || [];
      case 'militaryWeapons':
        return militaryWeapons || [];
      case 'highTechWeapons':
        return highTechWeapons || [];
      default:
        return [];
    }
  };

  const isLoading =
    isLoadingGadgets ||
    isLoadingGear ||
    isLoadingLowTech ||
    isLoadingMilitary ||
    isLoadingHighTech;

  const handleRoll = () => {
    setIsRolling(true);
    const availableItems = getAvailableItems();

    if (availableItems.length === 0) {
      setIsRolling(false);
      return;
    }

    // Randomly select items (with replacement, so duplicates are possible)
    const selected: (IGadget | IGear | IWeapon)[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      selected.push(availableItems[randomIndex]);
    }

    // Simulate a small delay for better UX
    setTimeout(() => {
      setRolledItems(selected);
      setIsRolling(false);
    }, 300);
  };

  const handleConfirm = () => {
    if (rolledItems.length > 0) {
      onConfirm(rolledItems);
      // Don't close here - let the parent handle closing after mutation succeeds
    }
  };

  const handleCancel = () => {
    setRolledItems([]);
    onClose();
  };

  const getItemTypeLabel = () => {
    switch (itemType) {
      case 'gadgets':
        return 'Gadgets';
      case 'gear':
        return 'Gear';
      case 'lowTechWeapons':
        return 'Low-Tech Weapons';
      case 'militaryWeapons':
        return 'Military Weapons';
      case 'highTechWeapons':
        return 'High-Tech Weapons';
      default:
        return 'Items';
    }
  };

  return (
    <Modal
      title={`Roll ${getItemTypeLabel()}`}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="roll"
          type="primary"
          onClick={handleRoll}
          disabled={rolledItems.length > 0 || isLoading || isRolling}
          loading={isRolling}
        >
          Roll {count} {getItemTypeLabel()}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={rolledItems.length === 0}
        >
          Confirm
        </Button>,
      ]}
    >
      <Space orientation="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text>
            You have <strong>{count}</strong> pending{' '}
            {getItemTypeLabel().toLowerCase()} roll{count !== 1 ? 's' : ''}.
          </Text>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '10px' }}>
              <Text type="secondary">Loading available items...</Text>
            </div>
          </div>
        )}

        {!isLoading && rolledItems.length > 0 && (
          <div>
            <Title level={5}>Rolled Items:</Title>
            <List
              size="small"
              dataSource={rolledItems}
              renderItem={(item) => (
                <List.Item>
                  <Space
                    orientation="vertical"
                    size="small"
                    style={{ width: '100%' }}
                  >
                    <Text strong>{item.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.description}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}

        {!isLoading && rolledItems.length === 0 && (
          <Text type="secondary">Click "Roll" to generate your items.</Text>
        )}
      </Space>
    </Modal>
  );
}

export default RollItemModal;
