import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('items')
export class ItemsController {
    constructor(private readonly db: DatabaseService) {}

    @Get('gear')
    async getAllGear() {
        return this.db.getAllGear();
    }

    @Get('gear/:id')
    async getGearById(@Param('id') id: string) {
        return this.db.getGearById(id);
    }

    @Get('gadgets')
    async getAllGadgets() {
        return this.db.getAllGadgets();
    }

    @Get('gadgets/:id')
    async getGadgetById(@Param('id') id: string) {
        return this.db.getGadgetById(id);
    }

    @Get('weapons')
    async getAllWeapons(@Query('type') type?: 'military' | 'lowTech' | 'highTech') {
        if (type) {
            return this.db.getWeaponsByType(type);
        }
        return this.db.getAllWeapons();
    }

    @Get('weapons/:id')
    async getWeaponById(@Param('id') id: string) {
        return this.db.getWeaponById(id);
    }
}
