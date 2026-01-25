import { IBackground, ICharacterClass, IMotivation } from '@five-parsecs/parsec-api';

type CrewMemberDescriptionProps = {
  data: IBackground | IMotivation | ICharacterClass;
};

export default function CrewMemberDescription({ data }: CrewMemberDescriptionProps) {
  const items: string[] = [];

  // Collect all descriptions
  if (data.effect?.length > 0) {
    items.push(...data.effect.map((effect) => effect.description));
  }
  if (data.resources?.length > 0) {
    items.push(...data.resources.map((resource) => resource.description));
  }
  if (data.startingRolls?.length > 0) {
    items.push(...data.startingRolls.map((startingRoll) => startingRoll.description));
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div style={{ fontSize: '12px', color: '#666' }}>
      {items.join(', ')}
    </div>
  );
}