import { useQuery } from '@tanstack/react-query';
import { Alert, Card } from 'antd';
import { useState } from 'react';

import { api } from '../../../services/api';
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
  /** Set when Primary Alien or Strange Character: a random species was picked from the list. */
  speciesId?: string;
}

function rollToSpeciesType(): (typeof ROLL_BANDS)[number] {
  const diceRoll = Math.floor(Math.random() * 100) + 1;
  const band =
    ROLL_BANDS.find((b) => diceRoll >= b.min && diceRoll <= b.max) ?? ROLL_BANDS[0];
  return band;
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

  const { data: primaryAliens = [], isFetched: primaryAliensFetched } = useQuery({
    queryKey: ['primaryAliens'],
    queryFn: api.primaryAliens.getAll,
  });
  const { data: strangeCharacters = [], isFetched: strangeCharactersFetched } = useQuery({
    queryKey: ['strangeCharacters'],
    queryFn: api.strangeCharacters.getAll,
  });
  const { data: allSpecies = [] } = useQuery({
    queryKey: ['species'],
    queryFn: api.species.getAll,
  });

  const listsReady = primaryAliensFetched && strangeCharactersFetched;

  const displayName =
    selectedSpeciesType?.speciesId && allSpecies.length > 0
      ? allSpecies.find((s) => s.id === selectedSpeciesType.speciesId)?.name ?? selectedSpeciesType.name
      : selectedSpeciesType?.name ?? '';

  const rollDice = () => {
    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomBand = ROLL_BANDS[Math.floor(Math.random() * ROLL_BANDS.length)];
      setRollingText(randomBand.name);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const band = rollToSpeciesType();
        const result: RolledSpeciesType = { speciesTypeId: band.speciesTypeId, name: band.name };

        if (band.name === 'Primary Alien' && primaryAliens.length > 0) {
          const picked = primaryAliens[Math.floor(Math.random() * primaryAliens.length)];
          result.speciesId = picked.speciesId;
        } else if (band.name === 'Strange Character' && strangeCharacters.length > 0) {
          const picked = strangeCharacters[Math.floor(Math.random() * strangeCharacters.length)];
          result.speciesId = picked.speciesId;
        }

        onSelect(result);
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
        resultText={displayName}
        onRoll={rollDice}
        disabled={!listsReady}
      />

      {selectedSpeciesType && !isRolling && (
        <Card size="small" style={{ textAlign: 'left' }}>
          <Alert
            title={displayName}
            description={
              selectedSpeciesType.speciesId
                ? `${selectedSpeciesType.name} — randomized species`
                : 'Roll to determine crew member type. 60% Human, 20% Primary Alien, 10% Bot, 10% Strange Character.'
            }
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}

export default CrewTypeRoller;
