import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('modules')
export class ModulesController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllModules();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getModuleById(id);
    }
}
