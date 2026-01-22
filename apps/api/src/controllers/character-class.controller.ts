import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('character-class')
export class CharacterClassController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllCharacterClasses();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getCharacterClassById(id);
    }
}
