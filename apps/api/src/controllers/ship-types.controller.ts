import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('ship-types')
export class ShipTypesController {
    constructor(private readonly databaseService: DatabaseService) { }

    @Get()
    findAll() {
        return this.databaseService.getAllShipTypes();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.databaseService.getShipTypeById(id);
    }
}
