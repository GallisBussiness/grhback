import { Module } from '@nestjs/common';
import { NominationService } from './nomination.service';
import { NominationController } from './nomination.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Nomination, NominationSchema } from './entities/nomination.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:Nomination.name,schema: NominationSchema}])],
  controllers: [NominationController],
  providers: [NominationService],
})
export class NominationModule {}
