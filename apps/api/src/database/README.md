# JSON Database

This directory contains the JSON-based database setup using `lowdb`.

## Structure

- `db.json` - The actual database file containing all data
- `database.service.ts` - Service providing methods to interact with the database
- `database.module.ts` - Global module making the database available throughout the API

## Usage

The `DatabaseService` is globally available and can be injected into any controller or service:

```typescript
import { DatabaseService } from '../database/database.service';

@Controller('species')
export class SpeciesController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async findAll() {
    return this.db.getAllSpecies();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.db.getSpeciesById(id);
  }

  @Post()
  async create(@Body() species: ISpecies) {
    return this.db.addSpecies(species);
  }
}
```

## Available Methods

### Species
- `getAllSpecies()` - Get all species
- `getSpeciesById(id)` - Get species by ID
- `addSpecies(species)` - Add new species

### Backgrounds
- `getAllBackgrounds()` - Get all backgrounds
- `getBackgroundById(id)` - Get background by ID
- `addBackground(background)` - Add new background

### Classes
- `getAllClasses()` - Get all classes
- `getClassById(id)` - Get class by ID
- `addClass(classData)` - Add new class

### Crew Types
- `getAllCrewTypes()` - Get all crew types
- `getCrewTypeById(id)` - Get crew type by ID
- `addCrewType(crewType)` - Add new crew type

### Utility
- `resetDatabase()` - Clear all data from database

## Data Persistence

All changes are automatically persisted to `db.json`. The database is initialized on module load and reads/writes to the file system.
