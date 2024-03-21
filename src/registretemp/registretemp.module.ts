import { Module } from '@nestjs/common';
import { RegistretempService } from './registretemp.service';
import { RegistretempController } from './registretemp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Registretemp, RegistretempSchema } from './entities/registretemp.entity';

@Module({
  imports:[MongooseModule.forFeature([{name: Registretemp.name,schema: RegistretempSchema}])],
  // controllers: [RegistretempController],
  providers: [RegistretempService],
  exports:[RegistretempService],
})
export class RegistretempModule {}
