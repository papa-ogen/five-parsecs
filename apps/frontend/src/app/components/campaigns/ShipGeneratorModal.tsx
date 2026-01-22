import { TrophyOutlined } from '@ant-design/icons';
import type { IShipType } from '@five-parsecs/parsec-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, Form, Input, Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '../../../services/api';

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
        // Final roll - use actual dice roll logic
        const diceRoll = Math.floor(Math.random() * 100) + 1;
        const finalShip = shipTypes.find(
          (ship) => diceRoll >= ship.rollMin && diceRoll <= ship.rollMax
        ) || shipTypes[0];
        
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
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {/* Dice Rolling Area */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '40px',
            marginBottom: '24px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }}
        >
          {isRolling ? (
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                animation: 'pulse 0.5s infinite',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🎰 {rollingText} 🎰
            </div>
          ) : selectedShip ? (
            <div>
              <TrophyOutlined
                style={{
                  fontSize: '48px',
                  color: '#ffd700',
                  marginBottom: '16px',
                }}
              />
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {selectedShip.name}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '48px', color: 'white' }}>
              🎲
            </div>
          )}
        </div>

        {/* Roll Button */}
        <Button
          type="primary"
          size="large"
          onClick={rollDice}
          disabled={isRolling}
          loading={isRolling}
          style={{
            fontSize: '18px',
            height: '50px',
            paddingLeft: '40px',
            paddingRight: '40px',
            marginBottom: '24px',
          }}
        >
          {isRolling ? 'Rolling...' : selectedShip ? 'Roll Again' : 'Roll the Dice!'}
        </Button>

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

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>
      </div>
    </Modal>
  );
}

export default ShipGeneratorModal;
