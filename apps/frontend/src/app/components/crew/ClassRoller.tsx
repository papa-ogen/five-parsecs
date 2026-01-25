import type { ICharacterClass } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Spin } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import DiceRoller from '../common/DiceRoller';

interface ClassRollerProps {
  onSelect: (characterClass: ICharacterClass) => void;
  selectedClass?: ICharacterClass | null;
}

export function ClassRoller({ onSelect, selectedClass }: ClassRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('');

  const { data: classes, isLoading } = useQuery({
    queryKey: ['characterClasses'],
    queryFn: api.characterClasses.getAll,
  });

  const rollDice = () => {
    if (!classes || classes.length === 0) return;

    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomClass = classes[Math.floor(Math.random() * classes.length)];
      setRollingText(randomClass.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalClass = classes[Math.floor(Math.random() * classes.length)];
        
        onSelect(finalClass);
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
        resultText={selectedClass?.name}
        onRoll={rollDice}
      />

      {selectedClass && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            title={selectedClass.name}
            description={selectedClass.description}
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default ClassRoller;
