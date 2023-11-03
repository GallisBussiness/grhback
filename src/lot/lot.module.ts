import { Module } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from './entities/lot.entity';

@Module({
  imports:[MongooseModule.forFeature([{name: Lot.name,schema: LotSchema}])],
  controllers: [LotController],
  providers: [LotService],
})
export class LotModule {}
