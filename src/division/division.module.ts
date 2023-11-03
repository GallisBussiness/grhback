import { Module } from '@nestjs/common';
import { DivisionService } from './division.service';
import { DivisionController } from './division.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Division, DivisionSchema } from './entities/division.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Division.name,useFactory: () => {
   const schema =  DivisionSchema;
   schema.plugin(require('mongoose-autopopulate'));
   return schema;
  }}])],
  controllers: [DivisionController],
  providers: [DivisionService],
})
export class DivisionModule {}
