import { Module } from '@nestjs/common';
import { AttributionGlobaleService } from './attribution-globale.service';
import { AttributionGlobaleController } from './attribution-globale.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributionGlobale, AttributionGlobaleSchema } from './entities/attribution-globale.entity';

@Module({
  imports: [MongooseModule.forFeatureAsync([{name: AttributionGlobale.name, useFactory:() =>{
   const  schema = AttributionGlobaleSchema;
   schema.plugin(require('mongoose-autopopulate'));
   return schema;
  }}])],
  controllers: [AttributionGlobaleController],
  providers: [AttributionGlobaleService],
})
export class AttributionGlobaleModule {}
