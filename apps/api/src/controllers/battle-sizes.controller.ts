import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('battle-sizes')
export class BattleSizesController {
    constructor(private readonly databaseService: DatabaseService) { }

    @Get()
    findAll() {
        return this.databaseService.getAllBattleSizes();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.databaseService.getBattleSizeById(id);
    }
}
