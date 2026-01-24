import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('species-abilities')
export class SpeciesAbilitiesController {
    constructor(private readonly databaseService: DatabaseService) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.databaseService.getSpeciesAbilityById(id);
    }
}
