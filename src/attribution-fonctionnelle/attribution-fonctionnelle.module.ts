import { Module } from '@nestjs/common';
import { AttributionFonctionnelleService } from './attribution-fonctionnelle.service';
import { AttributionFonctionnelleController } from './attribution-fonctionnelle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributionFonctionnelle, AttributionFonctionnelleSchema } from './entities/attribution-fonctionnelle.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:AttributionFonctionnelle.name,schema: AttributionFonctionnelleSchema}])],
  controllers: [AttributionFonctionnelleController],
  providers: [AttributionFonctionnelleService],
})
export class AttributionFonctionnelleModule {}
