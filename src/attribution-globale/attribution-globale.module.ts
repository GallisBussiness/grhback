import { Module } from '@nestjs/common';
import { AttributionGlobaleService } from './attribution-globale.service';
import { AttributionGlobaleController } from './attribution-globale.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributionGlobale, AttributionGlobaleSchema } from './entities/attribution-globale.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: AttributionGlobale.name,schema: AttributionGlobaleSchema}])],
  controllers: [AttributionGlobaleController],
  providers: [AttributionGlobaleService],
})
export class AttributionGlobaleModule {}
