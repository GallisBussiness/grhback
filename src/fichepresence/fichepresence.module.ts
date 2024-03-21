import { Module } from '@nestjs/common';
import { FichepresenceService } from './fichepresence.service';
import { FichepresenceController } from './fichepresence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fichepresence, FichepresenceSchema } from './entities/fichepresence.entity';
import { PresenceModule } from 'src/presence/presence.module';
import { EmployeModule } from 'src/employe/employe.module';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name:Fichepresence.name,useFactory:() =>{
   const schema =  FichepresenceSchema;
   schema.plugin(require('mongoose-serial'), { field:"ref",prefix:"PRES",separator:"-"});
   return schema;
  }}]),
  PresenceModule,
  EmployeModule
],
  controllers: [FichepresenceController],
  providers: [FichepresenceService],
})
export class FichepresenceModule {}
