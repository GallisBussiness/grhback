import { Module } from '@nestjs/common';
import { TemporaireService } from './temporaire.service';
import { TemporaireController } from './temporaire.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Temporaire, TemporaireSchema } from './entities/temporaire.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name:Temporaire.name,useFactory: () => {
    const schema = TemporaireSchema;
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
  }}])],
  controllers: [TemporaireController],
  providers: [TemporaireService],
  exports:[TemporaireService],
})
export class TemporaireModule {}
