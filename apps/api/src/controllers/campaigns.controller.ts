import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('campaigns')
export class CampaignsController {
    constructor(private readonly db: DatabaseService) { }

    @Get()
    async findAll() {
        return this.db.getAllCampaigns();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.db.getCampaignById(id);
    }

    @Post()
    async create(@Body() campaign: any) {
        return this.db.addCampaign(campaign);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() campaign: any) {
        return this.db.updateCampaign(id, campaign);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.db.deleteCampaign(id);
    }
}
