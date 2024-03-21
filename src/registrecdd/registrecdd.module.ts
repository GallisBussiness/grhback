import { Module } from '@nestjs/common';
import { RegistrecddService } from './registrecdd.service';
import { RegistrecddController } from './registrecdd.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Registrecdd, RegistrecddSchema } from './entities/registrecdd.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Registrecdd.name,useFactory:() => {
    const schema = RegistrecddSchema;
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
  }}])],
  // controllers: [RegistrecddController],
  providers: [RegistrecddService],
  exports:[RegistrecddService]
})
export class RegistrecddModule {}
