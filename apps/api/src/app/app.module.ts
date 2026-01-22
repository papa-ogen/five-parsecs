import { Module } from '@nestjs/common';

import { BackgroundsController } from '../controllers/background.controller';
import { CharacterClassesController } from '../controllers/character-class.controller';
import { CrewTypesController } from '../controllers/crew-type.controller';
import { ModulesController } from '../controllers/module.controller';
import { SpecialCircumstancesController } from '../controllers/special-circumstance.controller';
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
    CharacterClassesController,
    CrewTypesController,
    SpecialCircumstancesController,
  ],
  providers: [AppService],
})
export class AppModule { }
