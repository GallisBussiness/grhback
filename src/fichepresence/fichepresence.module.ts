import { Module } from '@nestjs/common';
import { FichepresenceService } from './fichepresence.service';
import { FichepresenceController } from './fichepresence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fichepresence, FichepresenceSchema } from './entities/fichepresence.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name:Fichepresence.name,useFactory:() =>{
   const schema =  FichepresenceSchema;
   schema.plugin(require('mongoose-serial'), { field:"ref",prefix:"PRES",separator:"-"});
   return schema;
  }}])],
  controllers: [FichepresenceController],
  providers: [FichepresenceService],
})
export class FichepresenceModule {}
