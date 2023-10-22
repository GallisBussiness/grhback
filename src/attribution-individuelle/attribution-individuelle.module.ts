import { Module } from '@nestjs/common';
import { AttributionIndividuelleService } from './attribution-individuelle.service';
import { AttributionIndividuelleController } from './attribution-individuelle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributionIndividuelle, AttributionIndividuelleSchema } from './entities/attribution-individuelle.entity';

@Module({
  imports:[MongooseModule.forFeature([{name: AttributionIndividuelle.name,schema: AttributionIndividuelleSchema}])],
  controllers: [AttributionIndividuelleController],
  providers: [AttributionIndividuelleService],
})
export class AttributionIndividuelleModule {}
