import type { IMotivation } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Spin } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import DiceRoller from '../common/DiceRoller';

interface MotivationRollerProps {
  onSelect: (motivation: IMotivation) => void;
  selectedMotivation?: IMotivation | null;
}

export function MotivationRoller({ onSelect, selectedMotivation }: MotivationRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('');

  const { data: motivations, isLoading } = useQuery({
    queryKey: ['motivations'],
    queryFn: api.motivations.getAll,
  });

  const rollDice = () => {
    if (!motivations || motivations.length === 0) return;

    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
      setRollingText(randomMotivation.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        
        onSelect(finalMotivation);
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
        resultText={selectedMotivation?.name}
        onRoll={rollDice}
      />

      {selectedMotivation && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            title={selectedMotivation.name}
            description={selectedMotivation.description}
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default MotivationRoller;
