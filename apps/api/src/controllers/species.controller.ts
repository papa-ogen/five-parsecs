import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('species')
export class SpeciesController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllSpecies();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getSpeciesById(id);
    }
}
