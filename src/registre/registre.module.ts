import { Module } from '@nestjs/common';
import { RegistreService } from './registre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Registre, RegistreSchema } from './entities/registre.entity';
@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Registre.name,useFactory:() => {
    const schema = RegistreSchema;
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
  }}])],
  providers: [RegistreService],
  exports:[RegistreService]
})
export class RegistreModule {}
