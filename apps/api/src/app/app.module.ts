import { Module } from '@nestjs/common';

import { BackgroundsController } from '../controllers/background.controller';
import { BattleSizesController } from '../controllers/battle-sizes.controller';
import { CampaignCharactersController } from '../controllers/campaign-characters.controller';
import { CampaignCrewsController } from '../controllers/campaign-crews.controller';
import { CampaignsController } from '../controllers/campaigns.controller';
import { CharacterClassesController } from '../controllers/character-class.controller';
import { CrewFlavorController } from '../controllers/crew-flavor.controller';
import { ItemsController } from '../controllers/items.controller';
import { MotivationsController } from '../controllers/motivations.controller';
import { PrimaryAliensController } from '../controllers/primary-aliens.controller';
import { ShipTypesController } from '../controllers/ship-types.controller';
import { StrangeCharactersController } from '../controllers/strange-characters.controller';
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
    PrimaryAliensController,
    StrangeCharactersController,
    BackgroundsController,
    CharacterClassesController,
    MotivationsController,
    ShipTypesController,
    BattleSizesController,
    ItemsController,
    CrewFlavorController,
    CampaignsController,
    CampaignCrewsController,
    CampaignCharactersController,
  ],
  providers: [AppService],
})
export class AppModule { }
