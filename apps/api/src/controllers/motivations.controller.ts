import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('motivations')
export class MotivationsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  findAll() {
    return this.databaseService.getAllMotivations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databaseService.getMotivationById(id);
  }
}
