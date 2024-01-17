import { Injectable } from '@nestjs/common';
import { CreateTemporaireDto } from './dto/create-temporaire.dto';
import { UpdateTemporaireDto } from './dto/update-temporaire.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Temporaire, TemporaireDocument } from './entities/temporaire.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TemporaireService extends AbstractModel<Temporaire,CreateTemporaireDto,UpdateTemporaireDto>{
  constructor(@InjectModel(Temporaire.name) private readonly temporaireModel: Model<TemporaireDocument>){
    super(temporaireModel);
  }
}
