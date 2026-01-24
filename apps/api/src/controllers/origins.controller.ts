import { Controller, Get, Param } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('origins')
export class OriginsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  findAll() {
    return this.databaseService.getAllOrigins();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databaseService.getOriginById(id);
  }
}
