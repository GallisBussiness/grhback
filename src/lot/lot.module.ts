import { Module } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from './entities/lot.entity';
import { EmployeModule } from 'src/employe/employe.module';
import { AttributionGlobaleModule } from 'src/attribution-globale/attribution-globale.module';
import { AttributionFonctionnelleModule } from 'src/attribution-fonctionnelle/attribution-fonctionnelle.module';
import { ExclusionSpecifiqueModule } from 'src/exclusion-specifique/exclusion-specifique.module';
import { AttributionIndividuelleModule } from 'src/attribution-individuelle/attribution-individuelle.module';
import { NominationModule } from 'src/nomination/nomination.module';
import { ImpotModule } from 'src/impot/impot.module';
import { RegistreModule } from 'src/registre/registre.module';

@Module({
  imports:[MongooseModule.forFeature([{name: Lot.name,schema: LotSchema}]),
  EmployeModule,
  AttributionGlobaleModule,
  AttributionFonctionnelleModule,
  ExclusionSpecifiqueModule,
  AttributionIndividuelleModule,
  NominationModule,
  ImpotModule,
  RegistreModule
],
  controllers: [LotController],
  providers: [LotService],
})
export class LotModule {}
