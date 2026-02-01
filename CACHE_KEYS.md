# React Query Cache Keys Documentation

This document outlines all React Query cache keys used in the application and when they should be invalidated.

## Cache Keys

### 1. `['campaigns']`
**What it stores:** List of all campaigns

**Used in:**
- `Campaigns.tsx` - Fetches all campaigns for dropdown

**Invalidated when:**
- Creating a new campaign (`CreateCampaign.tsx`)
- Updating a campaign (`campaigns.update`)
- Deleting a campaign
- Creating a crew member (`Crew.tsx` - because backend may add story points to campaign)

---

### 2. `['campaignCrew', crewId]`
**What it stores:** Single campaign crew data (including credits, ship, reputation, etc.)

**Used in:**
- `CrewDetails.tsx` - Displays crew resources and stats
- `CampaignShip.tsx` - Checks if crew has a ship
- `Crew.tsx` - Checks if crew has a ship before showing crew members

**Invalidated when:**
- Updating crew data (`CampaignShip.tsx` - when setting up ship)
- Creating a crew member (`Crew.tsx` - because backend updates crew.characterIds)
- Updating crew resources (credits, reputation, etc.)

---

### 3. `['campaignCharacters']`
**What it stores:** List of ALL campaign characters (from all campaigns)

**Used in:**
- `Crew.tsx` - Fetches all characters, then filters by crewId

**Invalidated when:**
- Creating a crew member (`Crew.tsx`)
- Updating a crew member
- Deleting a crew member

**Optimistic updates:**
- When creating a character, the new character is immediately added to cache using `setQueryData`

---

### 4. `['species']`
**What it stores:** List of all species

**Used in:**
- `CreateCrewMemberModal.tsx` - Maps crew types to species

**Invalidated when:**
- Rarely (this is reference data)

---

### 5. `['species-abilities', abilityId]` (potential)
**What it stores:** Species ability stats

**Used in:**
- `CreateCrewMemberModal.tsx` - Fetches abilities via API call (not cached currently)

**Note:** Currently not using React Query for this - using direct API call

---

### 6. `['backgrounds']`
**What it stores:** List of all backgrounds

**Used in:**
- `BackgroundRoller.tsx` - Fetches backgrounds for rolling

**Invalidated when:**
- Rarely (this is reference data)

---

### 8. `['motivations']`
**What it stores:** List of all motivations

**Used in:**
- `MotivationRoller.tsx` - Fetches motivations for rolling

**Invalidated when:**
- Rarely (this is reference data)

---

### 9. `['characterClasses']`
**What it stores:** List of all character classes

**Used in:**
- `ClassRoller.tsx` - Fetches classes for rolling

**Invalidated when:**
- Rarely (this is reference data)

---

### 10. `['shipTypes']`
**What it stores:** List of all ship types

**Used in:**
- `ShipGeneratorModal.tsx` - Fetches ship types for random generation

**Invalidated when:**
- Rarely (this is reference data)

---

## Cache Invalidation Flow

### When Creating a Crew Member:
1. ✅ Invalidate `['campaignCharacters']` - Refresh character list
2. ✅ Invalidate `['campaignCrew', crewId]` - Refresh crew (backend updates characterIds, credits, patrons, etc.)
3. ✅ Invalidate `['campaigns']` - Refresh campaign (backend may add story points)
4. ✅ Optimistic update to `['campaignCharacters']` - Instant UI feedback

### When Creating a Campaign:
1. ✅ Invalidate `['campaigns']` - Refresh campaign list
2. ✅ Auto-select new campaign (triggers fetch of crew data)

### When Setting Up Ship:
1. ✅ Invalidate `['campaignCrew']` - Refresh crew data (ship info updated)
2. ✅ Invalidate `['campaigns']` - Refresh campaign list (optional, but safe)

### When Deleting a Character:
1. ⚠️ TODO: Should invalidate `['campaignCharacters']`
2. ⚠️ TODO: Should invalidate `['campaignCrew', crewId]` (backend updates characterIds)

---

## Best Practices

1. **Always invalidate parent collections** when creating/deleting items
2. **Invalidate related data** when updates affect multiple entities (e.g., crew.characterIds)
3. **Use specific cache keys** with IDs for single items: `['entity', id]`
4. **Use optimistic updates** for better UX on create/update operations
5. **Reference data** (species, backgrounds, etc.) rarely needs invalidation

---

## Potential Improvements

1. **Implement character deletion** with proper cache invalidation
2. **Add character update** mutation with cache invalidation
3. **Consider paginated queries** for large character lists (use `queryKey: ['campaignCharacters', { page, limit }]`)
4. **Add error boundaries** for failed cache updates
5. **Implement cache persistence** for offline support
