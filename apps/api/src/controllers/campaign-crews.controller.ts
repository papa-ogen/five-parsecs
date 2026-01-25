import { ICampaignCrew } from '@five-parsecs/parsec-api';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('campaign-crews')
export class CampaignCrewsController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllCampaignCrews();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getCampaignCrewById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() crew: Partial<ICampaignCrew>) {
        return this.db.updateCampaignCrew(id, crew);
    }
}
