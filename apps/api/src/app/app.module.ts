import { Module } from '@nestjs/common';

import { BackgroundsController } from '../controllers/background.controller';
import { CampaignCharactersController } from '../controllers/campaign-characters.controller';
import { CampaignCrewsController } from '../controllers/campaign-crews.controller';
import { CampaignsController } from '../controllers/campaigns.controller';
import { CharacterClassesController } from '../controllers/character-class.controller';
import { CrewTypesController } from '../controllers/crew-type.controller';
import { MotivationsController } from '../controllers/motivations.controller';
import { ShipTypesController } from '../controllers/ship-types.controller';
import { SpeciesAbilitiesController } from '../controllers/species-abilities.controller';
import { SpeciesController } from '../controllers/species.controller';
import { DatabaseModule } from '../database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    SpeciesController,
    SpeciesAbilitiesController,
    BackgroundsController,
    CharacterClassesController,
    CrewTypesController,
    MotivationsController,
    ShipTypesController,
    CampaignsController,
    CampaignCrewsController,
    CampaignCharactersController,
  ],
  providers: [AppService],
})
export class AppModule { }
