import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('background')
export class BackgroundController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllBackgrounds();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getBackgroundById(id);
    }
}
