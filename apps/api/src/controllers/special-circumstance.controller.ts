import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('special-circumstances')
export class SpecialCircumstancesController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllSpecialCircumstances();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getSpecialCircumstanceById(id);
    }
}
