import { Module } from '@nestjs/common';
import { RubriqueService } from './rubrique.service';
import { RubriqueController } from './rubrique.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rubrique, RubriqueSchema } from './entities/rubrique.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name:Rubrique.name,useFactory:() => {
   const schema = RubriqueSchema;
   schema.plugin(require('mongoose-autopopulate'))
   return schema;
  }}])],
  controllers: [RubriqueController],
  providers: [RubriqueService],
})
export class RubriqueModule {}
