import { Controller,Param, Delete } from '@nestjs/common';
import { BulletinscddService } from './bulletinscdd.service';

@Controller('bulletinscdd')
export class BulletinscddController {
  constructor(private readonly bulletinscddService: BulletinscddService) {}
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bulletinscddService.remove(id);
  }
}
