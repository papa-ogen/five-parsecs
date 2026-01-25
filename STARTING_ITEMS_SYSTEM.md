# Starting Items System Documentation

## Overview

The starting items system provides a structured way to handle starting equipment (weapons, gear, gadgets, armor) from backgrounds, motivations, and character classes.

## Data Structure

### IStartingItem Interface

```typescript
export type ItemType = 'weapon' | 'gear' | 'gadget' | 'armor';
export type WeaponSubtype = 'military' | 'lowTech' | 'highTech' | 'any';

export interface IStartingItem {
    id: string;
    itemType: ItemType;
    subtype?: WeaponSubtype;  // Only for weapons
    amount: number;
    description: string;
}
```

### Usage in Interfaces

Starting items are used in:
- `IBackground` - Character background equipment
- `IMotivation` - Motivation-based equipment
- `ICharacterClass` - Class-specific equipment

```typescript
export interface ICharacterClass {
    id: string;
    name: string;
    description: string;
    effect: IEffect[];
    resources: IResourceEffect[];
    startingRolls: IStartingItem[];  // Array of starting items
}
```

## Item Types

| Item Type | Description | Examples |
|-----------|-------------|----------|
| `weapon` | Combat weapons | Pistols, rifles, melee weapons |
| `gear` | General equipment | Tools, supplies, survival gear |
| `gadget` | High-tech devices | Scanners, communicators, tech tools |
| `armor` | Protective equipment | Body armor, shields, helmets |

## Weapon Subtypes

Weapons can have specific subtypes:

| Subtype | Description | Examples |
|---------|-------------|----------|
| `military` | Military-grade weapons | Assault rifles, combat pistols |
| `lowTech` | Simple/primitive weapons | Clubs, knives, basic firearms |
| `highTech` | Advanced weapons | Plasma guns, energy weapons |
| `any` | Any weapon type | Player's choice |

## Examples

### Military Weapon

**Motivation: "Glory"**
- Original: `"startingRolls": "+1 Military Weapon"`
- Converted:
```json
"startingRolls": [
  {
    "id": "1",
    "itemType": "weapon",
    "subtype": "military",
    "amount": 1,
    "description": "+1 Military Weapon"
  }
]
```

### Low-Tech Weapon

**Character Class: "Primitive"**
- Original: `"startingRolls": "+1 Low-tech Weapon"`
- Converted:
```json
"startingRolls": [
  {
    "id": "8",
    "itemType": "weapon",
    "subtype": "lowTech",
    "amount": 1,
    "description": "+1 Low-tech Weapon"
  }
]
```

### High-Tech Weapon

**Character Class: "Scavenger"**
- Original: `"startingRolls": "+1 High-tech Weapon"`
- Converted:
```json
"startingRolls": [
  {
    "id": "15",
    "itemType": "weapon",
    "subtype": "highTech",
    "amount": 1,
    "description": "+1 High-tech Weapon"
  }
]
```

### Gear

**Character Class: "Technician"**
- Original: `"startingRolls": "+1 Gear"`
- Converted:
```json
"startingRolls": [
  {
    "id": "5",
    "itemType": "gear",
    "amount": 1,
    "description": "+1 Gear"
  }
]
```

### Gadget

**Motivation: "Technology"**
- Original: `"startingRolls": "+1 Gadget"`
- Converted:
```json
"startingRolls": [
  {
    "id": "3",
    "itemType": "gadget",
    "amount": 1,
    "description": "+1 Gadget"
  }
]
```

### No Starting Items

**Motivation: "Wealth"**
- Original: `"startingRolls": "-"`
- Converted:
```json
"startingRolls": []
```

## Applying Starting Items

### Backend (Character Creation)

When creating a character, starting items should be collected from:
1. Background starting items
2. Motivation starting items
3. Character class starting items

```typescript
function collectStartingItems(
  background: IBackground,
  motivation: IMotivation,
  characterClass: ICharacterClass
): IStartingItem[] {
  return [
    ...background.startingRolls,
    ...motivation.startingRolls,
    ...characterClass.startingRolls
  ];
}

// Apply to crew/character
function applyStartingItems(
  crew: ICampaignCrew,
  items: IStartingItem[]
) {
  items.forEach(item => {
    switch (item.itemType) {
      case 'weapon':
        if (item.subtype === 'military') {
          crew.militaryWeapons += item.amount;
        } else if (item.subtype === 'lowTech') {
          crew.lowTechWeapons += item.amount;
        } else if (item.subtype === 'highTech') {
          crew.highTechWeapons += item.amount;
        }
        break;
      case 'gear':
        crew.gears += item.amount;
        break;
      case 'gadget':
        crew.gadgets += item.amount;
        break;
      case 'armor':
        // Add to armor collection
        break;
    }
  });
}
```

### Frontend (Display)

Display starting items to users during character creation:

```typescript
function StartingItemBadge({ item }: { item: IStartingItem }) {
  const getIcon = () => {
    switch (item.itemType) {
      case 'weapon': return '🔫';
      case 'gear': return '🎒';
      case 'gadget': return '🔧';
      case 'armor': return '🛡️';
      default: return '📦';
    }
  };
  
  const getColor = () => {
    switch (item.itemType) {
      case 'weapon': return 'red';
      case 'gear': return 'blue';
      case 'gadget': return 'purple';
      case 'armor': return 'green';
      default: return 'default';
    }
  };
  
  return (
    <Tag color={getColor()}>
      {getIcon()} {item.description}
    </Tag>
  );
}
```

### Item Selection UI

For weapons with subtypes, allow player to select specific weapon:

```typescript
function WeaponSelector({ item }: { item: IStartingItem }) {
  const [selectedWeapon, setSelectedWeapon] = useState<IWeapon | null>(null);
  
  // Fetch available weapons based on subtype
  const { data: weapons } = useQuery({
    queryKey: ['weapons', item.subtype],
    queryFn: () => api.weapons.getBySubtype(item.subtype),
    enabled: item.itemType === 'weapon'
  });
  
  return (
    <div>
      <h4>{item.description}</h4>
      <Select
        placeholder="Choose your weapon"
        onChange={(weaponId) => {
          const weapon = weapons?.find(w => w.id === weaponId);
          setSelectedWeapon(weapon || null);
        }}
      >
        {weapons?.map(weapon => (
          <Select.Option key={weapon.id} value={weapon.id}>
            {weapon.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
```

## Migration

The conversion from string to structured starting items was performed using `scripts/convert-starting-rolls.js`.

**Conversion Summary:**
- ✅ Backgrounds: 0 converted (no backgrounds have starting items)
- ✅ Motivations: 17 converted
- ✅ Character Classes: 23 converted
- ✅ Total starting items created: 15

## Item Distribution

| Item Type | Count | Examples |
|-----------|-------|----------|
| Weapons (Low-Tech) | 6 | Primitive, Ganger, Troubleshooter |
| Weapons (Military) | 2 | Glory, Mercenary |
| Weapons (High-Tech) | 1 | Scavenger |
| Gear | 4 | Discovery, Technician, Nomad, Explorer |
| Gadget | 2 | Technology, Scientist, Special Agent |

## Character Creation Flow

### Step 1: Collect Items
```typescript
const background = backgrounds.find(b => b.id === 'tech-guild');
const motivation = motivations.find(m => m.id === 'technology');
const characterClass = classes.find(c => c.id === 'scientist');

const allItems = collectStartingItems(background, motivation, characterClass);
// Result: [
//   { itemType: 'gadget', amount: 1, description: '+1 Gadget' },  // from motivation
//   { itemType: 'gadget', amount: 1, description: '+1 Gadget' }   // from class
// ]
```

### Step 2: Apply to Crew
```typescript
applyStartingItems(crew, allItems);
// crew.gadgets = 2
```

### Step 3: Let Player Select Specific Items
For weapons, gear, gadgets - let player choose from available options:
```typescript
// Show selection UI for each item
allItems.forEach(item => {
  if (item.itemType === 'weapon') {
    // Show weapon selection based on subtype
  } else if (item.itemType === 'gear') {
    // Show gear selection
  } else if (item.itemType === 'gadget') {
    // Show gadget selection
  }
});
```

## Type Guards

```typescript
// Check if item is a weapon
function isWeapon(item: IStartingItem): boolean {
  return item.itemType === 'weapon';
}

// Check weapon subtype
function isMilitaryWeapon(item: IStartingItem): boolean {
  return item.itemType === 'weapon' && item.subtype === 'military';
}
```

## Future Enhancements

1. **Random Selection**: Some items could be randomly selected from a pool
2. **Quality Levels**: Items could have quality modifiers (poor, standard, excellent)
3. **Customization**: Allow player to customize/modify starting items
4. **Trade-offs**: Allow trading one item type for another
5. **Conditional Items**: Items that depend on other choices

## Benefits

### Type Safety
- ✅ Strongly typed item types
- ✅ TypeScript validates structure
- ✅ IDE autocomplete for properties

### Flexibility
- ✅ Easy to add new item types
- ✅ Easy to add weapon subtypes
- ✅ Supports multiple items per source

### Maintainability
- ✅ Structured data is easier to query
- ✅ Easier to display in UI
- ✅ Easier to apply programmatically
- ✅ Self-documenting code

### Game Balance
- ✅ Easy to track what equipment characters start with
- ✅ Easy to balance starting loadouts
- ✅ Clear separation of weapon types

## Testing Considerations

When testing character creation:
1. Verify all starting items are collected correctly
2. Test items from multiple sources (background + motivation + class)
3. Verify weapon subtypes are handled correctly
4. Test empty starting items (no equipment)
5. Ensure item descriptions display correctly in UI
6. Test item selection UI for weapons/gear/gadgets
7. Verify crew counters are updated correctly
