# Effects System Documentation

## Overview

The effects system provides a structured way to handle stat bonuses and modifications from backgrounds, motivations, and character classes.

## Data Structure

### IEffect Interface

```typescript
export interface IEffect {
    id: string;           // Unique identifier
    abilityId: string;    // Property name to modify (e.g., "savvy", "combat", "xp")
    amount: number;       // Amount to add/subtract
    description: string;  // Human-readable description (e.g., "+1 Savvy")
}
```

### Usage in Interfaces

Effects are used in:
- `IBackground` - Character background bonuses
- `IMotivation` - Motivation-based bonuses
- `ICharacterClass` - Class-specific bonuses
- `ITalent` (future) - Talent effects

```typescript
export interface IBackground {
    id: string;
    name: string;
    description: string;
    effect: IEffect[];    // Array of effects
    resources: string;
    startinRolls: string;
}
```

## Ability IDs

Valid `abilityId` values correspond to character stat properties:

| Ability ID | Maps To | Description |
|------------|---------|-------------|
| `reactions` | `ICampaignCharacter.reactions` | Initiative/reflexes |
| `speed` | `ICampaignCharacter.speed` | Movement speed |
| `combat` | `ICampaignCharacter.combat` | Combat skill |
| `toughness` | `ICampaignCharacter.toughness` | Health/durability |
| `savvy` | `ICampaignCharacter.savvy` | Intelligence/wisdom |
| `luck` | `ISpeciesAbility.luck` | Luck stat (optional) |
| `xp` | `ICampaignCharacter.xp` | Experience points |

## Examples

### Single Effect

**Background: "Peaceful, High-Tech Colony"**
- Original: `"effect": "+1 Savvy"`
- Converted:
```json
"effect": [
  {
    "id": "1",
    "abilityId": "savvy",
    "amount": 1,
    "description": "+1 Savvy"
  }
]
```

### Multiple Effects

**Character Class: "Working Class"**
- Original: `"effect": "+1 Savvy, +1 Luck"`
- Converted:
```json
"effect": [
  {
    "id": "21",
    "abilityId": "savvy",
    "amount": 1,
    "description": "+1 Savvy, +1 Luck"
  },
  {
    "id": "22",
    "abilityId": "luck",
    "amount": 1,
    "description": "+1 Savvy, +1 Luck"
  }
]
```

### No Effect

**Background: "Drifter"**
- Original: `"effect": "-"`
- Converted:
```json
"effect": []
```

### XP Bonus

**Motivation: "Revenge"**
- Original: `"effect": "+2 XP"`
- Converted:
```json
"effect": [
  {
    "id": "18",
    "abilityId": "xp",
    "amount": 2,
    "description": "+2 XP"
  }
]
```

## Applying Effects

### Backend (Character Creation)

When creating a character, effects should be applied from:
1. Species base stats (from `ISpeciesAbility`)
2. Background effects
3. Motivation effects
4. Character class effects

```typescript
// Example: Applying effects
function applyEffects(character: ICampaignCharacter, effects: IEffect[]) {
  effects.forEach(effect => {
    if (effect.abilityId in character) {
      character[effect.abilityId as keyof ICampaignCharacter] += effect.amount;
    }
  });
}
```

### Frontend (Display)

Effects can be displayed to users during character creation:

```typescript
// Example: Rendering effects
function EffectBadge({ effect }: { effect: IEffect }) {
  if (effect.amount > 0) {
    return <Tag color="green">{effect.description}</Tag>;
  } else if (effect.amount < 0) {
    return <Tag color="red">{effect.description}</Tag>;
  }
  return null;
}
```

## Migration

The conversion from string to structured effects was performed using `scripts/convert-effects.js`.

**Conversion Summary:**
- ✅ Backgrounds: 25 converted
- ✅ Motivations: 17 converted
- ✅ Character Classes: 23 converted
- ✅ Total effects created: 38

## Future Enhancements

1. **Conditional Effects**: Effects that apply only under certain conditions
2. **Temporary Effects**: Effects that expire after X turns
3. **Percentage Modifiers**: Effects that modify stats by percentage
4. **Special Effects**: Non-stat effects (e.g., "Reroll failed saves")
5. **Effect Stacking Rules**: Define how duplicate effects combine

## Database Schema

Effects are stored inline within their parent objects:

```json
{
  "backgrounds": [
    {
      "id": "peaceful-high-tech-colony",
      "name": "Peaceful, High-Tech Colony",
      "description": "...",
      "effect": [
        {
          "id": "1",
          "abilityId": "savvy",
          "amount": 1,
          "description": "+1 Savvy"
        }
      ],
      "resources": "...",
      "startinRolls": "..."
    }
  ]
}
```

## Type Safety

The effect system is fully type-safe:
- `IEffect` is strongly typed
- All interfaces using effects are updated
- TypeScript will catch any misuse of the effect structure

## Testing Considerations

When testing character creation:
1. Verify all effects are applied correctly
2. Test multiple effects from different sources
3. Verify XP effects don't interfere with stat effects
4. Test empty effect arrays (no effects)
5. Ensure effect descriptions display correctly in UI
