import { Injectable,HttpException, UnauthorizedException } from '@nestjs/common';
import { CreateEmployeDto, TypeEmploye } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Employe, EmployeDocument } from './entities/employe.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EmployeService extends AbstractModel<Employe,CreateEmployeDto,UpdateEmployeDto>{
 constructor(@InjectModel(Employe.name) private readonly employeModel: Model<EmployeDocument> ){
  super(employeModel);
 }

 async findByCode(code: string):Promise<Employe> {
  try {
    return await this.employeModel.findOne({code})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async findAllCdi():Promise<Employe[]> {
  try {
    return await this.employeModel.find({type: TypeEmploye.CDI})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async findAllCdd():Promise<Employe[]> {
  try {
    return await this.employeModel.find({type: TypeEmploye.CDD})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async updatePassword(id: string,dto: {oldPass: string,newPass: string}):Promise<Boolean> {
  try {
    const user = await this.findOne(id);
    if (!user || user.password !== dto.oldPass) {
        throw new UnauthorizedException();
    }
    return await this.employeModel.findByIdAndUpdate(id,{$set:{password:dto.newPass}});
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async findActive():Promise<Employe[]> {
  try {
    return await this.employeModel.find({is_actif: true,type: TypeEmploye.CDI})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async findActiveCdd():Promise<Employe[]> {
  try {
    return await this.employeModel.find({is_actif: true,type:TypeEmploye.CDD})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async findByMat(mat: string):Promise<Employe> {
  try {
    return await this.employeModel.findOne({nci: mat})
  } catch (error) {
    throw new HttpException(error.message, 500)
  }
 }

 async toggleState(id: string, dto: {is_actif: boolean}):Promise<Employe> {
  try {
   return this.employeModel.findByIdAndUpdate(id,dto)
  } catch (error) {
    throw new HttpException(error.message, 500);
  }
 }

}
