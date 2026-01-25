# Data-Driven Resources - Before & After

## The Problem

**Original approach** used string-based amounts that required parsing at runtime:
```json
{
  "amount": "+1D6"  // ❌ String requires parsing
}
```

## The Solution

**New approach** uses structured, data-driven objects that are type-safe and efficient:
```json
{
  "amount": {       // ✅ Structured data
    "numDice": 1,
    "diceSize": 6
  }
}
```

---

## Before & After Comparison

### Fixed Amount

**Before:**
```json
{
  "resourceType": "patrons",
  "amount": "+1",
  "description": "Patron"
}
```

**After:**
```json
{
  "resourceType": "patrons",
  "amount": 1,
  "description": "Patron"
}
```

---

### Single Die Roll (1D6)

**Before:**
```json
{
  "resourceType": "credits",
  "amount": "+1D6",
  "description": "+1D6 credits"
}
```

**After:**
```json
{
  "resourceType": "credits",
  "amount": {
    "numDice": 1,
    "diceSize": 6
  },
  "description": "+1D6 credits"
}
```

---

### Multiple Dice (2D6)

**Before:**
```json
{
  "resourceType": "credits",
  "amount": "+2D6",
  "description": "+2D6 credits"
}
```

**After:**
```json
{
  "resourceType": "credits",
  "amount": {
    "numDice": 2,
    "diceSize": 6
  },
  "description": "+2D6 credits"
}
```

---

## Code Comparison

### Calculating Amount

**Before (String Parsing):**
```typescript
function parseAmount(amountStr: string): number {
  // Complex regex parsing
  if (amountStr.includes('D')) {
    const match = amountStr.match(/([+\-]?)(\d*)D(\d+)/i);
    if (match) {
      const numDice = parseInt(match[2] || '1');
      const diceSize = parseInt(match[3]);
      // Roll dice...
    }
  }
  return parseInt(amountStr) || 0;
}
```

**After (Structured Data):**
```typescript
function calculateAmount(amount: number | IDiceRoll): number {
  // Simple type check
  if (typeof amount === 'number') {
    return amount;
  }
  
  // Direct property access
  let total = 0;
  for (let i = 0; i < amount.numDice; i++) {
    total += Math.floor(Math.random() * amount.diceSize) + 1;
  }
  return total + (amount.modifier || 0);
}
```

---

## Benefits

| Aspect | Before (String) | After (Structured) |
|--------|----------------|-------------------|
| **Type Safety** | ❌ No type checking | ✅ Fully typed |
| **Parsing** | ❌ Runtime regex | ✅ No parsing needed |
| **IDE Support** | ❌ No autocomplete | ✅ Full autocomplete |
| **Performance** | ❌ Slower (parsing) | ✅ Faster (direct access) |
| **Validation** | ❌ Runtime errors | ✅ Compile-time errors |
| **Range Calc** | ❌ Complex | ✅ Simple math |
| **Testing** | ❌ Edge cases | ✅ Straightforward |

---

## Type Definitions

```typescript
export interface IDiceRoll {
    numDice: number;    // How many dice to roll
    diceSize: number;   // Size of each die (6, 8, 10, 12, 20)
    modifier?: number;  // Optional +/- modifier
}

export interface IResourceEffect {
    id: string;
    resourceType: ResourceType;
    amount: number | IDiceRoll;  // Union type!
    description: string;
}
```

---

## Real-World Examples

### Background: "Wealthy Merchant Family"

```json
{
  "id": "wealthy-merchant-family",
  "name": "Wealthy Merchant Family",
  "resources": [
    {
      "id": "2",
      "resourceType": "credits",
      "amount": {
        "numDice": 2,
        "diceSize": 6
      },
      "description": "+2D6 credits"
    }
  ]
}
```

**Min possible:** 2 credits (rolling 1+1)  
**Max possible:** 12 credits (rolling 6+6)  
**Average:** ~7 credits

### Motivation: "Loyalty"

```json
{
  "id": "loyalty",
  "name": "Loyalty",
  "resources": [
    {
      "id": "16",
      "resourceType": "patrons",
      "amount": 1,
      "description": "Patron"
    },
    {
      "id": "17",
      "resourceType": "storyPoints",
      "amount": 1,
      "description": "+1 story point"
    }
  ]
}
```

**Result:** Always +1 patron, +1 story point (no randomness)

---

## Migration Path

### Step 1: String → IResourceEffect[]
`scripts/convert-resources.js` converted:
- `"resources": "Patron, +1 story point"` 
- → `resources: [{ resourceType: "patrons", amount: "1", ... }]`

### Step 2: String Amount → Structured Amount  
`scripts/convert-resources-v2.js` converted:
- `amount: "+1D6"`
- → `amount: { numDice: 1, diceSize: 6 }`

### Final Result
**39 resources converted:**
- 29 fixed amounts (e.g., `amount: 1`)
- 10 dice rolls (e.g., `{ numDice: 1, diceSize: 6 }`)

---

## Usage in Application

### Display Resource Range

```typescript
function ResourceBadge({ resource }: { resource: IResourceEffect }) {
  const { amount } = resource;
  
  if (typeof amount === 'number') {
    return <Tag>+{amount}</Tag>;
  }
  
  // Show dice notation and range
  const min = amount.numDice;
  const max = amount.numDice * amount.diceSize;
  
  return (
    <Tag>
      {amount.numDice}D{amount.diceSize} ({min}-{max})
    </Tag>
  );
}
```

### Roll Dice on Character Creation

```typescript
function applyResources(crew: ICampaignCrew, resources: IResourceEffect[]) {
  resources.forEach(resource => {
    let amount: number;
    
    if (typeof resource.amount === 'number') {
      amount = resource.amount;
    } else {
      // Actually roll the dice
      amount = 0;
      for (let i = 0; i < resource.amount.numDice; i++) {
        amount += Math.floor(Math.random() * resource.amount.diceSize) + 1;
      }
    }
    
    // Apply to crew
    switch (resource.resourceType) {
      case 'credits': crew.credits += amount; break;
      case 'patrons': crew.patrons += amount; break;
      // ...
    }
  });
}
```

---

## Conclusion

✅ **Type-safe** - No runtime parsing errors  
✅ **Efficient** - Direct property access  
✅ **Flexible** - Easy to extend (add modifiers, new dice types)  
✅ **Testable** - Predictable behavior  
✅ **Maintainable** - Self-documenting structure  

The data-driven approach provides a solid foundation for the resource system! 🎲
