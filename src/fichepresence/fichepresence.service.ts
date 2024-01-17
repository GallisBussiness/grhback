import { Injectable,HttpException } from '@nestjs/common';
import { CreateFichepresenceDto } from './dto/create-fichepresence.dto';
import { UpdateFichepresenceDto } from './dto/update-fichepresence.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Fichepresence, FichepresenceDocument } from './entities/fichepresence.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MonthDto } from './dto/month.dto';
import { Presence } from 'src/presence/entities/presence.entity';
import { compareAsc, parseISO } from 'date-fns';

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

 async findByCode(code: string):Promise<Fichepresence> {
  try {
   return this.ficheModel.findOne({code})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async findAll():Promise<Fichepresence[]> {
  try {
   return this.ficheModel.aggregate([{$addFields: {
    id: { $toString: "$_id" }
 }},{
  $lookup: {
    from: "presences",
    localField: "id",
    foreignField: "fiche",
    pipeline: [
      {
        $addFields: {
          empId: {
            $toObjectId: "$employe",
          },
        },
      },
      {
        $lookup: {
          from: "employes",
          localField: "empId",
          foreignField: "_id",
          as: "employe",
        },
      },
      {
        $unwind:"$employe"
      }
    ],
    as: "presences",
  }
 }])
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async getByMonth(monthDto: MonthDto):Promise<any> {
  try {
   return this.ficheModel.aggregate([{
    $match: {
      mois:monthDto.mois,
      annee:monthDto.annee
    }
   },{$addFields: {
    id: { $toString: "$_id" }
 }},{
  $lookup: {
    from: "presences",
    localField: "id",
    foreignField: "fiche",
    pipeline: [
      {
        $addFields: {
          empId: {
            $toObjectId: "$employe",
          },
        },
      },
      {
        $lookup: {
          from: "employes",
          localField: "empId",
          foreignField: "_id",
          as: "employe",
        },
      },
      {
        $unwind:"$employe"
      }
    ],
    as: "presences",
  }
 }])
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }
 async getByMonthAndEmploye(monthDto: MonthDto & {employe: string}):Promise<Presence[]> {
  try {
   const fiches = (await this.getByMonth({annee:monthDto.annee,mois: monthDto.mois}));
   if(fiches && fiches.length !== 0){
    let presences = [];
    fiches.forEach(f => {
      const p = f['presences'].filter(p => p.employe._id.toString() === monthDto.employe);
      presences = [...presences,...p];
    });
    
    return presences.sort((a,b) => compareAsc(parseISO(a.heure),parseISO(b.heure))).reverse();
   }else{
    return [];
   }

  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async findOne(id: string):Promise<any> {
  try {
   return this.ficheModel.aggregate([{$match:{
    "_id": new Types.ObjectId(id),
  }},{$addFields: {
    id: { $toString: "$_id" }
 }},{
  $lookup: {
    from: "presences",
    localField: "id",
    foreignField: "fiche",
    pipeline: [
      {
        $addFields: {
          empId: {
            $toObjectId: "$employe",
          },
        },
      },
      {
        $lookup: {
          from: "employes",
          localField: "empId",
          foreignField: "_id",
          as: "employe",
        },
      },
      {
        $unwind:"$employe"
      }
    ],
    as: "presences",
  }
 }])
  } catch (error) {
    throw new HttpException(error.message, 500);
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
