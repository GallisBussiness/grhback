import { Controller, Param, Delete } from '@nestjs/common';
import { BulletinService } from './bulletin.service';

@Controller('bulletin')
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bulletinService.remove(id);
  }
}
