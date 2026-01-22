import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('crew-type')
export class CrewTypeController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllCrewTypes();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getCrewTypeById(id);
    }
}
