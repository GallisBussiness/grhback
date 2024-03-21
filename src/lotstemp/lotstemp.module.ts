import { Module } from '@nestjs/common';
import { LotstempService } from './lotstemp.service';
import { LotstempController } from './lotstemp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LotsTempSchema, Lotstemp } from './entities/lotstemp.entity';
import { CaslModule } from 'src/casl/casl.module';
import { RegistretempModule } from 'src/registretemp/registretemp.module';
import { TemporaireModule } from 'src/temporaire/temporaire.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Lotstemp.name,schema: LotsTempSchema}]),
  RegistretempModule,
  TemporaireModule,
  StatusModule,
  CaslModule,
],
  controllers: [LotstempController],
  providers: [LotstempService],
})
export class LotstempModule {}
