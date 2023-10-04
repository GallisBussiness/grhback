import { Injectable,HttpException } from '@nestjs/common';
import { CreateFichepresenceDto } from './dto/create-fichepresence.dto';
import { UpdateFichepresenceDto } from './dto/update-fichepresence.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Fichepresence, FichepresenceDocument } from './entities/fichepresence.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FichepresenceService extends AbstractModel<Fichepresence,CreateFichepresenceDto,UpdateFichepresenceDto>{
 constructor(@InjectModel(Fichepresence.name) private readonly ficheModel: Model<FichepresenceDocument>){
  super(ficheModel);
 }
 async findOpened():Promise<Fichepresence[]> {
  try {
   return this.ficheModel.find({isOpen: true})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async toggleState(id: string, dto: {isOpen: boolean}):Promise<Fichepresence> {
  try {
   return this.ficheModel.findByIdAndUpdate(id,dto)
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }
}
