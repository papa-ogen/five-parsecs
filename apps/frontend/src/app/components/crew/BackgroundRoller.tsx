import type { IBackground } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Spin } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
import DiceRoller from '../common/DiceRoller';

interface BackgroundRollerProps {
  onSelect: (background: IBackground) => void;
  selectedBackground?: IBackground | null;
}

export function BackgroundRoller({ onSelect, selectedBackground }: BackgroundRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('');

  const { data: backgrounds, isLoading } = useQuery({
    queryKey: ['backgrounds'],
    queryFn: api.backgrounds.getAll,
  });

  const rollDice = () => {
    if (!backgrounds || backgrounds.length === 0) return;

    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      setRollingText(randomBackground.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        
        onSelect(finalBackground);
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
        resultText={selectedBackground?.name}
        onRoll={rollDice}
      />

      {selectedBackground && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            message={selectedBackground.name}
            description={selectedBackground.description}
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default BackgroundRoller;
