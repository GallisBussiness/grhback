import { Module } from '@nestjs/common';
import { LotscddService } from './lotscdd.service';
import { LotscddController } from './lotscdd.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lotscdd, LotscddSchema } from './entities/lotscdd.entity';
import { ImpotModule } from 'src/impot/impot.module';
import { RegistrecddModule } from 'src/registrecdd/registrecdd.module';
import { CaslModule } from 'src/casl/casl.module';
import { EmployeModule } from 'src/employe/employe.module';
import { AttributionGlobaleModule } from 'src/attribution-globale/attribution-globale.module';
import { AttributionIndividuelleModule } from 'src/attribution-individuelle/attribution-individuelle.module';
import { ExclusionSpecifiqueModule } from 'src/exclusion-specifique/exclusion-specifique.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Lotscdd.name,schema: LotscddSchema}]),
  EmployeModule,
  AttributionGlobaleModule,
  ExclusionSpecifiqueModule,
  AttributionIndividuelleModule,
  ImpotModule,
  RegistrecddModule,
  CaslModule,
],
  controllers: [LotscddController],
  providers: [LotscddService],
})
export class LotscddModule {}
