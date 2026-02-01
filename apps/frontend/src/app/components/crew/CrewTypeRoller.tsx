import { Alert, Card } from 'antd';
import { useState } from 'react';

import DiceRoller from '../common/DiceRoller';

/** Roll bands: 1–60 Human (60%), 61–80 Primary Alien (20%), 81–90 Bot (10%), 91–100 Strange (10%). Uses speciesTypeId. */
const ROLL_BANDS = [
  { min: 1, max: 60, speciesTypeId: '1', name: 'Human' },
  { min: 61, max: 80, speciesTypeId: '3', name: 'Primary Alien' },
  { min: 81, max: 90, speciesTypeId: '2', name: 'Bot' },
  { min: 91, max: 100, speciesTypeId: '4', name: 'Strange Character' },
] as const;

export interface RolledSpeciesType {
  speciesTypeId: string;
  name: string;
}

function rollToSpeciesType(): RolledSpeciesType {
  const diceRoll = Math.floor(Math.random() * 100) + 1;
  const band =
    ROLL_BANDS.find((b) => diceRoll >= b.min && diceRoll <= b.max) ?? ROLL_BANDS[0];
  return { speciesTypeId: band.speciesTypeId, name: band.name };
}

interface CrewTypeRollerProps {
  onSelect: (rolled: RolledSpeciesType) => void;
  selectedSpeciesType?: RolledSpeciesType | null;
}

export function CrewTypeRoller({
  onSelect,
  selectedSpeciesType,
}: CrewTypeRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('');

  const rollDice = () => {
    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomBand = ROLL_BANDS[Math.floor(Math.random() * ROLL_BANDS.length)];
      setRollingText(randomBand.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const final = rollToSpeciesType();
        onSelect(final);
        setRollingText('');
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <div>
      <DiceRoller
        isRolling={isRolling}
        rollingText={rollingText}
        resultText={selectedSpeciesType?.name}
        onRoll={rollDice}
      />

      {selectedSpeciesType && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            title={selectedSpeciesType.name}
            description="Roll to determine crew member type (species type). 60% Human, 20% Primary Alien, 10% Bot, 10% Strange Character."
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default CrewTypeRoller;
