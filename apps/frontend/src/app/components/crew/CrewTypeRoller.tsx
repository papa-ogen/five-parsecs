import type { ICrewType } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Spin } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import DiceRoller from '../common/DiceRoller';

interface CrewTypeRollerProps {
  onSelect: (crewType: ICrewType) => void;
  selectedCrewType?: ICrewType | null;
}

export function CrewTypeRoller({ onSelect, selectedCrewType }: CrewTypeRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('');

  const { data: crewTypes, isLoading } = useQuery({
    queryKey: ['crewTypes'],
    queryFn: api.crewTypes.getAll,
  });

  const rollDice = () => {
    if (!crewTypes || crewTypes.length === 0) return;

    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomCrewType = crewTypes[Math.floor(Math.random() * crewTypes.length)];
      setRollingText(randomCrewType.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        // Roll 1-100 and find matching crew type based on rollMin/rollMax
        const diceRoll = Math.floor(Math.random() * 100) + 1;
        const finalCrewType = crewTypes.find(
          (ct) => diceRoll >= ct.rollMin && diceRoll <= ct.rollMax
        ) || crewTypes[0];
        
        onSelect(finalCrewType);
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
        resultText={selectedCrewType?.name}
        onRoll={rollDice}
      />

      {selectedCrewType && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            title={selectedCrewType.name}
            description={selectedCrewType.description || 'Roll to determine crew member type'}
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default CrewTypeRoller;
