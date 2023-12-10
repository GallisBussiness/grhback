import { HttpException, Injectable } from '@nestjs/common';
import { CreateRegistreDto } from './dto/create-registre.dto';
import { UpdateRegistreDto } from './dto/update-registre.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Registre, RegistreDocument } from './entities/registre.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RegistreService extends AbstractModel<Registre,CreateRegistreDto,UpdateRegistreDto>{
  constructor(@InjectModel(Registre.name) private readonly registreModel: Model<RegistreDocument>){
    super(registreModel);
  }

  async findByAnneeAndOldMois(annee: number,mois: number): Promise<Registre[]> {
      try {
        return await this.registreModel.find({$and:[{annee},{mois:{$lte:mois}}]});
      } catch (error) {
        throw new HttpException(error.message,500);
      }
  }

  async findByAnneeAndMois(annee: number,mois: number): Promise<Registre> {
    try {
      return await this.registreModel.findOne({annee,mois});
    } catch (error) {
      throw new HttpException(error.message,500);
    }
}
}
