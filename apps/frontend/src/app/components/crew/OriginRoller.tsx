import type { IOrigin } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Spin } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import DiceRoller from '../common/DiceRoller';

interface OriginRollerProps {
  onSelect: (origin: IOrigin) => void;
  selectedOrigin?: IOrigin | null;
}

export function OriginRoller({ onSelect, selectedOrigin }: OriginRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('');

  const { data: origins, isLoading } = useQuery({
    queryKey: ['origins'],
    queryFn: api.origins.getAll,
  });

  const rollDice = () => {
    if (!origins || origins.length === 0) return;

    setIsRolling(true);

    // Simulate dice rolling with random text changes
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomOrigin = origins[Math.floor(Math.random() * origins.length)];
      setRollingText(randomOrigin.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        // Final roll - use actual dice roll logic
        const diceRoll = Math.floor(Math.random() * 100) + 1;
        const finalOrigin = origins.find(
          (origin) => diceRoll >= origin.rollMin && diceRoll <= origin.rollMax
        ) || origins[0];
        
        onSelect(finalOrigin);
        setRollingText('');
        setIsRolling(false);
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <DiceRoller
        isRolling={isRolling}
        rollingText={rollingText}
        resultText={selectedOrigin?.name}
        onRoll={rollDice}
      />

      {selectedOrigin && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            message={selectedOrigin.name}
            description={selectedOrigin.description}
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default OriginRoller;
