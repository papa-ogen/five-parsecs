import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { ICampaignCharacter } from '@five-parsecs/parsec-api';

@Controller('campaign-characters')
export class CampaignCharactersController {
    constructor(private readonly databaseService: DatabaseService) {}

    @Get()
    findAll(): ICampaignCharacter[] {
        return this.databaseService.getCampaignCharacters();
    }

    @Get(':id')
    findOne(@Param('id') id: string): ICampaignCharacter | undefined {
        return this.databaseService.getCampaignCharacterById(id);
    }

    @Post()
    create(@Body() data: Partial<ICampaignCharacter>): ICampaignCharacter {
        return this.databaseService.createCampaignCharacter(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<ICampaignCharacter>): ICampaignCharacter {
        return this.databaseService.updateCampaignCharacter(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string): void {
        this.databaseService.deleteCampaignCharacter(id);
    }
}
