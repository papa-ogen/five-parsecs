# Resources System Documentation

## Overview

The resources system provides a structured way to handle resource bonuses (credits, patrons, rivals, story points, etc.) from backgrounds, motivations, and character classes.

## Data Structure

### IResourceEffect Interface

```typescript
export type ResourceType = 
  | 'credits' 
  | 'storyPoints' 
  | 'reputation' 
  | 'patrons' 
  | 'rivals' 
  | 'questRumors' 
  | 'rumor';

export interface IDiceRoll {
    numDice: number;    // Number of dice to roll (e.g., 2 for 2D6)
    diceSize: number;   // Size of each die (6 for D6, 12 for D12)
    modifier?: number;  // Optional fixed modifier (+1, +2, etc.)
}

export interface IResourceEffect {
    id: string;           // Unique identifier
    resourceType: ResourceType;  // Type of resource
    amount: number | IDiceRoll;  // Fixed amount or dice roll
    description: string;  // Human-readable description
}
```

### Usage in Interfaces

Resources are used in:
- `IBackground` - Character background resources
- `IMotivation` - Motivation-based resources
- `ICharacterClass` - Class-specific resources

```typescript
export interface IBackground {
    id: string;
    name: string;
    description: string;
    effect: IEffect[];
    resources: IResourceEffect[];  // Array of resource effects
    startinRolls: string;
}
```

## Resource Types

| Resource Type | Maps To | Description |
|---------------|---------|-------------|
| `credits` | `ICampaignCrew.credits` | Money/currency |
| `storyPoints` | `ICampaign.storyPoints` | Story progression points |
| `reputation` | `ICampaignCrew.reputation` | Crew reputation |
| `patrons` | `ICampaignCrew.patrons` | Number of patrons |
| `rivals` | `ICampaignCrew.rivals` | Number of rivals |
| `questRumors` | Campaign quest system | Quest rumors |
| `rumor` | Campaign quest system | General rumors |

## Amount Format

The `amount` field is a **data-driven structure** that can be either:

### Fixed Amount (number)
Simple integer value:
```typescript
amount: 1  // Add 1 patron, rival, story point, etc.
```

### Dice Roll (IDiceRoll)
Structured object for random values:
```typescript
{
  numDice: 2,      // Roll 2 dice
  diceSize: 6,     // Each die is D6
  modifier: 1      // Optional: add +1 to result
}
```

| Type | Example | Rolls |
|------|---------|-------|
| Fixed | `amount: 1` | Always 1 |
| 1D6 | `{ numDice: 1, diceSize: 6 }` | 1-6 |
| 2D6 | `{ numDice: 2, diceSize: 6 }` | 2-12 |
| 1D6+2 | `{ numDice: 1, diceSize: 6, modifier: 2 }` | 3-8 |

## Examples

### Fixed Amount

**Background: "Religious Cult"**
- Original: `"resources": "Patron, +1 story point"`
- Converted:
```json
"resources": [
  {
    "id": "3",
    "resourceType": "patrons",
    "amount": 1,
    "description": "Patron"
  },
  {
    "id": "4",
    "resourceType": "storyPoints",
    "amount": 1,
    "description": "+1 story point"
  }
]
```

### Dice Roll (1D6)

**Background: "Peaceful, High-Tech Colony"**
- Original: `"resources": "+1D6 credits"`
- Converted:
```json
"resources": [
  {
    "id": "1",
    "resourceType": "credits",
    "amount": {
      "numDice": 1,
      "diceSize": 6
    },
    "description": "+1D6 credits"
  }
]
```

### Multiple Dice (2D6)

**Character Class: "Trader"**
- Original: `"resources": "+2D6 credits"`
- Converted:
```json
"resources": [
  {
    "id": "34",
    "resourceType": "credits",
    "amount": {
      "numDice": 2,
      "diceSize": 6
    },
    "description": "+2D6 credits"
  }
]
```

### Quest Rumors

**Background: "Isolationist Enclave"**
- Original: `"resources": "2 Quest Rumors"`
- Converted:
```json
"resources": [
  {
    "id": "8",
    "resourceType": "questRumors",
    "amount": "2",
    "description": "2 Quest Rumors"
  }
]
```

### No Resources

**Background: "Drifter"**
- Original: `"resources": "-"`
- Converted:
```json
"resources": []
```

### Rival

**Motivation: "Revenge"**
- Original: `"resources": "Rival"`
- Converted:
```json
"resources": [
  {
    "id": "18",
    "resourceType": "rivals",
    "amount": "1",
    "description": "Rival"
  }
]
```

## Applying Resources

### Backend (Character/Crew Creation)

When creating a character or crew, resources should be applied from:
1. Background resources
2. Motivation resources
3. Character class resources

```typescript
// Example: Applying resources to crew
function applyResources(crew: ICampaignCrew, resources: IResourceEffect[]) {
  resources.forEach(resource => {
    const amount = calculateAmount(resource.amount);
    
    switch (resource.resourceType) {
      case 'credits':
        crew.credits += amount;
        break;
      case 'storyPoints':
        // Apply to campaign
        campaign.storyPoints += amount;
        break;
      case 'patrons':
        crew.patrons += amount;
        break;
      case 'rivals':
        crew.rivals += amount;
        break;
      case 'reputation':
        crew.reputation += amount;
        break;
      // ... etc
    }
  });
}

// Helper to calculate final amount
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

### Frontend (Display)

Resources can be displayed to users during character creation:

```typescript
// Example: Rendering resources
function ResourceBadge({ resource }: { resource: IResourceEffect }) {
  const getColor = () => {
    switch (resource.resourceType) {
      case 'credits': return 'gold';
      case 'storyPoints': return 'purple';
      case 'patrons': return 'green';
      case 'rivals': return 'red';
      case 'reputation': return 'blue';
      default: return 'default';
    }
  };
  
  return <Tag color={getColor()}>{resource.description}</Tag>;
}
```

## Migration

The conversion from string to structured resources was performed in two steps:

### Step 1: `scripts/convert-resources.js`
Converted string resources to IResourceEffect[] objects

### Step 2: `scripts/convert-resources-v2.js`
Converted string amounts to data-driven structures (number | IDiceRoll)

**Conversion Summary:**
- ✅ Backgrounds: 10 amounts converted
- ✅ Motivations: 17 amounts converted
- ✅ Character Classes: 12 amounts converted
- ✅ Total amounts converted: 39
- ✅ Fixed amounts: 29 (e.g., `amount: 1`)
- ✅ Dice rolls: 10 (e.g., `{ numDice: 1, diceSize: 6 }`)

## Resource Application Flow

### During Character Creation:

1. **Roll/Select Background** → Apply background resources
2. **Roll/Select Motivation** → Apply motivation resources
3. **Roll/Select Class** → Apply class resources
4. **Calculate Totals** → Sum all resource effects
5. **Apply to Crew** → Update crew's resource pools

### Example Flow:

```typescript
// Character creation
const background = backgrounds.find(b => b.id === 'religious-cult');
const motivation = motivations.find(m => m.id === 'loyalty');
const characterClass = classes.find(c => c.id === 'negotiator');

// Collect all resources
const allResources = [
  ...background.resources,    // Patron, +1 story point
  ...motivation.resources,    // Patron, +1 story point
  ...characterClass.resources // Patron, +1 story point
];

// Apply to crew
applyResources(crew, allResources);

// Result:
// crew.patrons = 3
// campaign.storyPoints = 3
```

## Future Enhancements

1. **Conditional Resources**: Resources that apply only under certain conditions
2. **Temporary Resources**: Resources that expire after X turns
3. **Resource Caps**: Maximum limits for certain resources
4. **Resource Trading**: System for converting one resource to another
5. **Resource Events**: Special events triggered by resource thresholds

## Database Schema

Resources are stored inline within their parent objects:

```json
{
  "backgrounds": [
    {
      "id": "religious-cult",
      "name": "Religious Cult",
      "description": "...",
      "effect": [],
      "resources": [
        {
          "id": "3",
          "resourceType": "patrons",
          "amount": "1",
          "description": "Patron"
        },
        {
          "id": "4",
          "resourceType": "storyPoints",
          "amount": "+1",
          "description": "+1 story point"
        }
      ],
      "startinRolls": "-"
    }
  ]
}
```

## Type Safety

The resource system is fully type-safe:
- `IResourceEffect` is strongly typed
- `ResourceType` is a union type of valid resource types
- All interfaces using resources are updated
- TypeScript will catch any misuse of the resource structure

## Testing Considerations

When testing character/crew creation:
1. Verify all resources are applied correctly
2. Test dice roll resources (random values)
3. Test fixed amount resources
4. Verify multiple resources from different sources
5. Test empty resource arrays (no resources)
6. Ensure resource descriptions display correctly in UI
7. Test resource accumulation (multiple patrons, etc.)
8. Verify story points apply to campaign, not crew
