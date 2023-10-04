import { Injectable, HttpException } from '@nestjs/common';
import { CreatePresenceDto, TYPEPRESENCE } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Presence, PresenceDocument } from './entities/presence.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PresenceService extends AbstractModel<Presence,CreatePresenceDto,UpdatePresenceDto>{
 constructor(@InjectModel(Presence.name) private readonly presenceModel: Model<PresenceDocument>){
  super(presenceModel);
 }


 async findByFiche(fiche: string):Promise<Presence[]> {
  try {
    return await this.presenceModel.find({fiche}).sort( { createdAt : -1} );
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async createArrive(data: CreatePresenceDto):Promise<Presence> {
  try {
    const type = TYPEPRESENCE.ARRIVEE;
    const createdP = new this.model({...data,type});
    return await createdP.save();
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async createDepart(data: CreatePresenceDto):Promise<Presence> {
  try {
    const type = TYPEPRESENCE.DEPART;
    const createdP = new this.model({...data,type});
    return await createdP.save();
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

}
