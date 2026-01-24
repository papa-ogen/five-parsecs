# Five Parsecs From Home - Development Progress

## ✅ Completed Features

### Backend (NestJS API)

#### Database (`lowdb`)
- JSON-based database with all game data
- Campaign, crew, and character storage

#### API Endpoints
- `GET /modules` - Game modules/expansions
- `GET /species` - Character species
- `GET /backgrounds` - Character backgrounds  
- `GET /character-classes` - Character classes
- `GET /crew-types` - Crew types
- `GET /special-circumstances` - Special circumstances
- `GET /origins` - Character origins (with rollMin/rollMax)
- `GET /motivations` - Character motivations (with rollMin/rollMax)
- `GET /ship-types` - Ship types (with rollMin/rollMax)
- `GET /campaigns` - Campaign management (CRUD)

### Frontend (React + Ant Design)

#### Campaign Management
- ✅ **Campaign Selection** - Dropdown to select active campaign
- ✅ **Campaign Creation** - Modal with form validation (Zod)
- ✅ **Campaign Details** - Display campaign stats, status badges
- ✅ **Auto-select** - Newly created campaigns are automatically selected

#### Ship Setup
- ✅ **Ship Generator Modal** - Casino-style dice rolling UI
- ✅ **Ship Type Rolling** - Roll 1-100 to generate random ship
- ✅ **Ship Name Input** - Custom ship naming with validation
- ✅ **Auto-update** - Ship info displays in campaign details

#### Character Creation
- ✅ **Crew Component** - Main crew management interface
- ✅ **Character Modal** - Segmented tabs for character creation
- ✅ **DiceRoller Component** - Reusable casino-style roller with animations
- ✅ **Origin Roller** - Roll for character origin
- ✅ **Motivation Roller** - Roll for character motivation
- ✅ **Class Roller** - Roll for character class
- ✅ **Circumstances Roller** - Roll for special circumstances

### Shared Components
- ✅ **DiceRoller** - Reusable dice rolling component with casino animations
- ✅ **AppContext** - Global state management for campaigns
- ✅ **API Service** - Centralized API client with type safety

## 🔧 Technical Stack

- **Monorepo**: Nx workspace
- **Backend**: NestJS + lowdb (JSON database)
- **Frontend**: React 18 + TypeScript
- **UI Library**: Ant Design 5
- **State Management**: React Context + React Query
- **Forms**: React Hook Form + Zod validation
- **API**: RESTful with CORS enabled

## 🚧 TODO (Future Work)

### Backend
- [ ] Create crew member API endpoint
- [ ] Link crew members to campaigns
- [ ] Add species/background selection endpoints

### Frontend
- [ ] Complete crew member creation (save to API)
- [ ] Display crew member list
- [ ] Add species/background selection to character creation
- [ ] Implement talent system
- [ ] Add gear/weapon/armor selection
- [ ] Campaign turn management
- [ ] Credits/story points tracking

### Character Creation Flow
Current: Name → Origin → Motivation → Class → Circumstances
Missing: Species, Background, Talents, Stats, Gear

## 📁 Project Structure

```
five-parsecs/
├── apps/
│   ├── api/                    # NestJS backend
│   │   └── src/
│   │       ├── controllers/    # API endpoints
│   │       └── database/       # lowdb service + db.json
│   └── frontend/               # React frontend
│       └── src/
│           ├── app/
│           │   ├── components/
│           │   │   ├── campaigns/  # Campaign management
│           │   │   ├── crew/       # Crew management
│           │   │   └── common/     # Shared components
│           │   └── contexts/       # React Context
│           └── services/           # API client
└── libs/
    └── parsec-api/             # Shared TypeScript types
        └── src/lib/types.ts
```

## 🎯 Current Workflow

1. **Create Campaign** → Auto-selected
2. **Setup Ship** → Roll dice for ship type, enter ship name
3. **Add Crew Members** → Roll for origin, motivation, class, circumstances
4. (In Progress) Save crew members to database

## 🎲 Dice Rolling System

All dice rollers use the same pattern:
- Roll 1-100
- Match against `rollMin` and `rollMax` from database
- Casino-style animation (10 flashes)
- Display result with description

## 🔑 Key Design Decisions

1. **Module System**: `moduleId` optional field for expansion content (skipped for now)
2. **Single Source of Truth**: Campaign ID drives campaign state
3. **Reusable Components**: DiceRoller used across all character creation
4. **Type Safety**: Full TypeScript with shared types in `parsec-api` lib
5. **Ant Design**: Used `App` component for proper context (messages, modals)
