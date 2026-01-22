import { Module } from '@nestjs/common';

import { BackgroundsController } from '../controllers/backgrounds.controller';
import { CharacterClassController } from '../controllers/character-class.controller';
import { CrewTypesController } from '../controllers/crew-types.controller';
import { ModulesController } from '../controllers/modules.controller';
import { SpecialCircumstancesController } from '../controllers/special-circumstances.controller';
import { SpeciesController } from '../controllers/species.controller';
import { DatabaseModule } from '../database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    ModulesController,
    SpeciesController,
    BackgroundsController,
    CharacterClassController,
    CrewTypesController,
    SpecialCircumstancesController,
  ],
  providers: [AppService],
})
export class AppModule { }
