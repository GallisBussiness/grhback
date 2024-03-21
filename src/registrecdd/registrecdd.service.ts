import { HttpException, Injectable } from '@nestjs/common';
import { CreateRegistrecddDto } from './dto/create-registrecdd.dto';
import { UpdateRegistrecddDto } from './dto/update-registrecdd.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Registrecdd, RegistrecddDocument } from './entities/registrecdd.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RegistrecddService  extends AbstractModel<Registrecdd,CreateRegistrecddDto,UpdateRegistrecddDto>{
  constructor(@InjectModel(Registrecdd.name) private readonly registreModel: Model<RegistrecddDocument>){
    super(registreModel);
  }

  async findByAnneeAndOldMois(annee: number,mois: number): Promise<Registrecdd[]> {
      try {
        return await this.registreModel.find({$and:[{annee},{mois:{$lt:mois}}]});
      } catch (error) {
        throw new HttpException(error.message,500);
      }
  }

  async findByAnneeAndMois(annee: number,mois: number): Promise<Registrecdd> {
    try {
      return await this.registreModel.findOne({annee,mois});
    } catch (error) {
      throw new HttpException(error.message,500);
    }
}

async removeByLot(id: string): Promise<Registrecdd> {
  try {
    return await this.registreModel.findOneAndDelete({lot:id});
  } catch (error) {
    throw new HttpException(error.message,500);
  }
}
}
