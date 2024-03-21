import { Module } from '@nestjs/common';
import { BulletinscddService } from './bulletinscdd.service';
import { BulletinscddController } from './bulletinscdd.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bulletinscdd, bulletinscddSchema } from './entities/bulletinscdd.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Bulletinscdd.name, useFactory:()=> {
    const schema = bulletinscddSchema;
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
  }}])],
  // controllers: [BulletinscddController],
  providers: [BulletinscddService],
})
export class BulletinscddModule {}
