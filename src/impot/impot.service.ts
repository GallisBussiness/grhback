import { Injectable } from '@nestjs/common';
import { CreateImpotDto } from './dto/create-impot.dto';
import { UpdateImpotDto } from './dto/update-impot.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Impot, ImpotDocument } from './entities/impot.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ImpotService extends AbstractModel<Impot,CreateImpotDto,UpdateImpotDto>{
  constructor(@InjectModel(Impot.name) private readonly impotModel: Model<ImpotDocument>){
    super(impotModel);
  }
}
