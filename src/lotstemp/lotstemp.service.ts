import { HttpException, Injectable } from '@nestjs/common';
import { CreateLotstempDto } from './dto/create-lotstemp.dto';
import { UpdateLotstempDto } from './dto/update-lotstemp.dto';
import { LotsTempDocument, Lotstemp } from './entities/lotstemp.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Model } from 'mongoose';

@Injectable()
export class LotstempService extends AbstractModel<Lotstemp,CreateLotstempDto,UpdateLotstempDto>{
  constructor(@InjectModel(Lotstemp.name) private readonly lotstempModel: Model<LotsTempDocument>){
    super(lotstempModel);
  }


  async createLot(createLotDto:CreateLotstempDto): Promise<Lotstemp>{
    try {
      const d = createLotDto.debut.split('-');
      const annee = d[0];
      const mois = d[1];
      const createdLot = new this.lotstempModel({...createLotDto,annee: +annee,mois:+mois});
      return await createdLot.save();
    } catch (error) {
      throw new HttpException(error,500);
    }
  }
}
