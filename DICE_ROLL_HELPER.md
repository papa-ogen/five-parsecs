# Dice Roll System - Helper Functions

## Overview

The dice roll system uses structured data instead of string notation for type safety and easier computation.

## Data Structure

```typescript
export interface IDiceRoll {
    numDice: number;    // Number of dice to roll
    diceSize: number;   // Size of each die (6, 8, 10, 12, 20, etc.)
    modifier?: number;  // Optional fixed modifier
}
```

## Examples

| Notation | Structure | Range |
|----------|-----------|-------|
| 1D6 | `{ numDice: 1, diceSize: 6 }` | 1-6 |
| 2D6 | `{ numDice: 2, diceSize: 6 }` | 2-12 |
| 3D6 | `{ numDice: 3, diceSize: 6 }` | 3-18 |
| 1D6+2 | `{ numDice: 1, diceSize: 6, modifier: 2 }` | 3-8 |
| 2D6-1 | `{ numDice: 2, diceSize: 6, modifier: -1 }` | 1-11 |

## Helper Functions

### Calculate Amount

Use this to convert a resource amount (fixed or dice roll) to a final number:

```typescript
function calculateAmount(amount: number | IDiceRoll): number {
  // Fixed amount - just return it
  if (typeof amount === 'number') {
    return amount;
  }
  
  // Dice roll - roll the dice
  let total = 0;
  for (let i = 0; i < Math.abs(amount.numDice); i++) {
    total += Math.floor(Math.random() * amount.diceSize) + 1;
  }
  
  // Apply modifier if present
  if (amount.modifier) {
    total += amount.modifier;
  }
  
  // Apply sign from numDice
  return amount.numDice < 0 ? -total : total;
}
```

### Get Dice Range

Get min/max possible values for display purposes:

```typescript
function getDiceRange(amount: number | IDiceRoll): { min: number; max: number } {
  if (typeof amount === 'number') {
    return { min: amount, max: amount };
  }
  
  const absNumDice = Math.abs(amount.numDice);
  const min = absNumDice + (amount.modifier || 0);
  const max = (absNumDice * amount.diceSize) + (amount.modifier || 0);
  
  return amount.numDice < 0 
    ? { min: -max, max: -min }
    : { min, max };
}
```

### Format Dice for Display

Convert structure back to readable string:

```typescript
function formatDiceRoll(amount: number | IDiceRoll): string {
  if (typeof amount === 'number') {
    return amount > 0 ? `+${amount}` : `${amount}`;
  }
  
  const absNumDice = Math.abs(amount.numDice);
  const sign = amount.numDice < 0 ? '-' : '+';
  let str = `${sign}${absNumDice}D${amount.diceSize}`;
  
  if (amount.modifier) {
    str += amount.modifier > 0 ? `+${amount.modifier}` : `${amount.modifier}`;
  }
  
  return str;
}
```

## Usage Examples

### Backend (Character Creation)

```typescript
import { IResourceEffect, IDiceRoll } from '@five-parsecs/parsec-api';

// Apply resources when creating character
function applyResourceEffects(
  crew: ICampaignCrew, 
  campaign: ICampaign,
  resources: IResourceEffect[]
) {
  resources.forEach(resource => {
    const amount = calculateAmount(resource.amount);
    
    switch (resource.resourceType) {
      case 'credits':
        crew.credits += amount;
        console.log(`Added ${amount} credits`);
        break;
      case 'storyPoints':
        campaign.storyPoints += amount;
        console.log(`Added ${amount} story points`);
        break;
      case 'patrons':
        crew.patrons += amount;
        console.log(`Added ${amount} patrons`);
        break;
      // ... etc
    }
  });
}
```

### Frontend (Display)

```typescript
import { IResourceEffect } from '@five-parsecs/parsec-api';

// Display resource with range
function ResourceDisplay({ resource }: { resource: IResourceEffect }) {
  const range = getDiceRange(resource.amount);
  const formatted = formatDiceRoll(resource.amount);
  
  return (
    <div>
      <strong>{resource.resourceType}:</strong> {formatted}
      {range.min !== range.max && (
        <span className="range"> ({range.min}-{range.max})</span>
      )}
    </div>
  );
}

// Example output:
// credits: +1D6 (1-6)
// storyPoints: +1
// patrons: +1
```

### Frontend (Dice Animation)

```typescript
// Animate dice roll
function AnimatedDiceRoll({ amount }: { amount: number | IDiceRoll }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  
  const handleRoll = () => {
    setRolling(true);
    
    // Simulate rolling animation
    setTimeout(() => {
      const finalAmount = calculateAmount(amount);
      setResult(finalAmount);
      setRolling(false);
    }, 1000);
  };
  
  if (typeof amount === 'number') {
    return <span>{amount}</span>;
  }
  
  return (
    <div>
      <button onClick={handleRoll} disabled={rolling}>
        {rolling ? '🎲 Rolling...' : `Roll ${formatDiceRoll(amount)}`}
      </button>
      {result !== null && <span>Result: {result}</span>}
    </div>
  );
}
```

## Type Guards

```typescript
// Check if amount is a dice roll
function isDiceRoll(amount: number | IDiceRoll): amount is IDiceRoll {
  return typeof amount === 'object' && 'numDice' in amount;
}

// Usage
if (isDiceRoll(resource.amount)) {
  console.log(`Roll ${resource.amount.numDice}D${resource.amount.diceSize}`);
} else {
  console.log(`Fixed amount: ${resource.amount}`);
}
```

## Testing

```typescript
describe('Dice Roll System', () => {
  test('calculates fixed amount', () => {
    expect(calculateAmount(5)).toBe(5);
  });
  
  test('calculates 1D6 within range', () => {
    const roll = { numDice: 1, diceSize: 6 };
    const result = calculateAmount(roll);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });
  
  test('calculates 2D6 within range', () => {
    const roll = { numDice: 2, diceSize: 6 };
    const result = calculateAmount(roll);
    expect(result).toBeGreaterThanOrEqual(2);
    expect(result).toBeLessThanOrEqual(12);
  });
  
  test('applies modifier correctly', () => {
    const roll = { numDice: 1, diceSize: 6, modifier: 2 };
    const result = calculateAmount(roll);
    expect(result).toBeGreaterThanOrEqual(3); // 1+2
    expect(result).toBeLessThanOrEqual(8);    // 6+2
  });
  
  test('gets correct range', () => {
    expect(getDiceRange(5)).toEqual({ min: 5, max: 5 });
    expect(getDiceRange({ numDice: 1, diceSize: 6 }))
      .toEqual({ min: 1, max: 6 });
    expect(getDiceRange({ numDice: 2, diceSize: 6 }))
      .toEqual({ min: 2, max: 12 });
  });
});
```

## Benefits

### Type Safety
- ✅ No string parsing errors
- ✅ TypeScript validates structure
- ✅ IDE autocomplete for properties

### Flexibility
- ✅ Easy to add new dice types
- ✅ Easy to apply modifiers
- ✅ Easy to compute ranges

### Performance
- ✅ No regex parsing at runtime
- ✅ Direct property access
- ✅ Efficient calculations

### Maintainability
- ✅ Clear data structure
- ✅ Easy to test
- ✅ Self-documenting code
