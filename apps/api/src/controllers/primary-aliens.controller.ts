import { Controller, Get } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('primary-aliens')
export class PrimaryAliensController {
    constructor(private readonly db: DatabaseService) {}

    @Get()
    async findAll() {
        return this.db.getAllPrimaryAliens();
    }
}
