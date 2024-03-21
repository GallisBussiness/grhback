import { HttpException, Injectable } from '@nestjs/common';
import { CreateRegistretempDto } from './dto/create-registretemp.dto';
import { UpdateRegistretempDto } from './dto/update-registretemp.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Registretemp, RegistretempDocument } from './entities/registretemp.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RegistretempService extends AbstractModel<Registretemp,CreateRegistretempDto,UpdateRegistretempDto>{
  constructor(@InjectModel(Registretemp.name) private readonly registreModel: Model<RegistretempDocument>){
    super(registreModel);
  }

  async findByAnneeAndOldMois(annee: number,mois: number): Promise<Registretemp> {
      try {
        return await this.registreModel.findOne({$and:[{annee},{mois:{$lt:mois}}]});
      } catch (error) {
        throw new HttpException(error.message,500);
      }
  }

  async findByAnneeAndMois(annee: number,mois: number): Promise<Registretemp> {
    try {
      return await this.registreModel.findOne({annee,mois});
    } catch (error) {
      throw new HttpException(error.message,500);
    }
}

async removeByLot(id: string): Promise<Registretemp> {
  try {
    return await this.registreModel.findOneAndDelete({lot:id});
  } catch (error) {
    throw new HttpException(error.message,500);
  }
}
}
