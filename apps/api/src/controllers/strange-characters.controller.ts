import { Controller, Get } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Controller('strange-characters')
export class StrangeCharactersController {
    constructor(private readonly db: DatabaseService) {}

    @Get()
    async findAll() {
        return this.db.getAllStrangeCharacters();
    }
}
