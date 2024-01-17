import { Module } from '@nestjs/common';
import { TemporaireService } from './temporaire.service';
import { TemporaireController } from './temporaire.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Temporaire, TemporaireSchema } from './entities/temporaire.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:Temporaire.name,schema: TemporaireSchema}])],
  controllers: [TemporaireController],
  providers: [TemporaireService],
})
export class TemporaireModule {}
