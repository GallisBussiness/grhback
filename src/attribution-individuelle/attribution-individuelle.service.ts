import { Injectable } from '@nestjs/common';
import { CreateAttributionIndividuelleDto } from './dto/create-attribution-individuelle.dto';
import { UpdateAttributionIndividuelleDto } from './dto/update-attribution-individuelle.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { AttributionIndividuelle } from './entities/attribution-individuelle.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttributionFonctionnelleDocument } from 'src/attribution-fonctionnelle/entities/attribution-fonctionnelle.entity';

@Injectable()
export class AttributionIndividuelleService extends AbstractModel<AttributionIndividuelle,CreateAttributionIndividuelleDto,UpdateAttributionIndividuelleDto>{
  constructor(@InjectModel(AttributionIndividuelle.name) private readonly attributionIndividuelleModel: Model<AttributionFonctionnelleDocument>){
    super(attributionIndividuelleModel);
  }
}
