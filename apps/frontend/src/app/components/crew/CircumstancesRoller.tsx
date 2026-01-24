import type { ISpecialCircumstance } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Spin } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import DiceRoller from '../common/DiceRoller';

interface CircumstancesRollerProps {
  onSelect: (circumstance: ISpecialCircumstance) => void;
  selectedCircumstance?: ISpecialCircumstance | null;
}

export function CircumstancesRoller({ onSelect, selectedCircumstance }: CircumstancesRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('');

  const { data: circumstances, isLoading } = useQuery({
    queryKey: ['specialCircumstances'],
    queryFn: api.specialCircumstances.getAll,
  });

  const rollDice = () => {
    if (!circumstances || circumstances.length === 0) return;

    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomCircumstance = circumstances[Math.floor(Math.random() * circumstances.length)];
      setRollingText(randomCircumstance.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalCircumstance = circumstances[Math.floor(Math.random() * circumstances.length)];
        
        onSelect(finalCircumstance);
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
        resultText={selectedCircumstance?.name}
        onRoll={rollDice}
      />

      {selectedCircumstance && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            message={selectedCircumstance.name}
            description={selectedCircumstance.description}
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default CircumstancesRoller;
