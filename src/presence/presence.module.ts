import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Presence, PresenceSchema } from './entities/presence.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Presence.name,useFactory:() => {
     const schema = PresenceSchema;
     schema.plugin(require("mongoose-autopopulate"));
     return schema;
  }}])],
  controllers: [PresenceController],
  providers: [PresenceService],
  exports:[PresenceService]
})
export class PresenceModule {}
