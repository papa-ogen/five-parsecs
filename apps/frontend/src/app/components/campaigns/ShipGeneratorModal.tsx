import type { IShipType } from '@five-parsecs/parsec-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, Form, Input, Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '../../../services/api';
import DiceRoller from '../common/DiceRoller';

const shipNameSchema = z.object({
  shipName: z.string().min(1, 'Ship name is required').max(50, 'Ship name must be less than 50 characters'),
});

type ShipNameFormData = z.infer<typeof shipNameSchema>;

interface ShipGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (ship: IShipType, shipName: string) => void;
}

export function ShipGeneratorModal({ open, onClose, onConfirm }: ShipGeneratorModalProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [selectedShip, setSelectedShip] = useState<IShipType | null>(null);
  const [rollingText, setRollingText] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ShipNameFormData>({
    resolver: zodResolver(shipNameSchema),
    mode: 'onChange',
    defaultValues: {
      shipName: '',
    },
  });

  const { data: shipTypes, isLoading } = useQuery({
    queryKey: ['shipTypes'],
    queryFn: api.shipTypes.getAll,
    enabled: open,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      reset();
      setSelectedShip(null);
      setRollingText('');
      setIsRolling(false);
    }
  }, [open, reset]);

  const rollDice = () => {
    if (!shipTypes || shipTypes.length === 0) return;

    setIsRolling(true);
    setSelectedShip(null);

    // Simulate dice rolling with random text changes
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomShip = shipTypes[Math.floor(Math.random() * shipTypes.length)];
      setRollingText(randomShip.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalShip = shipTypes[Math.floor(Math.random() * shipTypes.length)];
        
        setSelectedShip(finalShip);
        setRollingText('');
        setIsRolling(false);
      }
    }, 100);
  };

  const handleConfirm = (data: ShipNameFormData) => {
    if (selectedShip) {
      onConfirm(selectedShip, data.shipName);
      reset();
    }
  };

  const handleCancel = () => {
    setSelectedShip(null);
    setRollingText('');
    setIsRolling(false);
    reset();
    onClose();
  };

  if (isLoading) {
    return (
      <Modal title="Ship Generator" open={open} footer={null}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div style={{ fontSize: '20px' }}>
          🎲 Ship Generator 🎲
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          disabled={!selectedShip || !isValid}
          onClick={handleSubmit(handleConfirm)}
        >
          Confirm Ship
        </Button>,
      ]}
      width={600}
    >
      <div style={{ padding: '20px' }}>
        <DiceRoller
          isRolling={isRolling}
          rollingText={rollingText}
          resultText={selectedShip?.name}
          onRoll={rollDice}
        />

        {/* Selected Ship Details */}
        {selectedShip && !isRolling && (
          <>
            <Card size="small" style={{ textAlign: 'left', marginBottom: '16px' }}>
              <Alert
                title={selectedShip.name}
                description={selectedShip.description}
                type="success"
                showIcon
              />
            </Card>

            {/* Ship Name Input */}
            <Form layout="vertical">
              <Form.Item
                label="Ship Name"
                validateStatus={errors.shipName ? 'error' : ''}
                help={errors.shipName?.message}
                required
              >
                <Controller
                  name="shipName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your ship's name..."
                      size="large"
                      maxLength={50}
                      showCount
                    />
                  )}
                />
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ShipGeneratorModal;
