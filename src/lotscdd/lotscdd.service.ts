import { HttpException, Injectable } from '@nestjs/common';
import { CreateLotscddDto } from './dto/create-lotscdd.dto';
import { UpdateLotscddDto } from './dto/update-lotscdd.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Lotscdd, LotscddDocument } from './entities/lotscdd.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LotscddService extends AbstractModel<Lotscdd,CreateLotscddDto,UpdateLotscddDto>{
  constructor(@InjectModel(Lotscdd.name) private readonly lotscddModel: Model<LotscddDocument>){
    super(lotscddModel);
  }


  async createLot(createLotDto:CreateLotscddDto): Promise<Lotscdd>{
    try {
      const d = createLotDto.debut.split('-');
      const annee = d[0];
      const mois = d[1];
      const createdLot = new this.lotscddModel({...createLotDto,annee: +annee,mois:+mois});
      return await createdLot.save();
    } catch (error) {
      throw new HttpException(error,500);
    }
  }
}
