import { Controller, Get } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly db: DatabaseService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('species')
  async getAllSpecies() {
    return this.db.getAllSpecies();
  }

  @Get('backgrounds')
  async getAllBackgrounds() {
    return this.db.getAllBackgrounds();
  }

  @Get('classes')
  async getAllClasses() {
    return this.db.getAllClasses();
  }

  @Get('crew-types')
  async getAllCrewTypes() {
    return this.db.getAllCrewTypes();
  }
}
