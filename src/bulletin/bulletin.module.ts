import { Module } from '@nestjs/common';
import { BulletinService } from './bulletin.service';
import { BulletinController } from './bulletin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bulletin, bulletinSchema } from './entities/bulletin.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Bulletin.name, useFactory:()=> {
    const schema = bulletinSchema;
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
  }}])],
  controllers: [BulletinController],
  providers: [BulletinService],
})
export class BulletinModule {}
