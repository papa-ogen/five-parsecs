import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('crew-flavor')
export class CrewFlavorController {
    constructor(private readonly db: DatabaseService) {}

    @Get('we-met-through')
    async getWeMetThrough() {
        return this.db.getAllWeMetThrough();
    }

    @Get('characterized-as')
    async getCharacterizedAs() {
        return this.db.getAllCaracterizedAs();
    }
}
