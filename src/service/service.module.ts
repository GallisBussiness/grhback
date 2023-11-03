import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './entities/service.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Service.name,useFactory: () => {
    const schema =  ServiceSchema;
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
  }}])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
