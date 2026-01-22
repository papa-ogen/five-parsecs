import { Module } from '@nestjs/common';

import { BackgroundController } from '../controllers/background.controller';
import { CharacterClassController } from '../controllers/character-class.controller';
import { CrewTypeController } from '../controllers/crew-type.controller';
import { ModuleController } from '../controllers/module.controller';
import { SpecialCircumstanceController } from '../controllers/special-circumstance.controller';
import { SpeciesController } from '../controllers/species.controller';
import { DatabaseModule } from '../database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    ModuleController,
    SpeciesController,
    BackgroundController,
    CharacterClassController,
    CrewTypeController,
    SpecialCircumstanceController,
  ],
  providers: [AppService],
})
export class AppModule { }
