import { Injectable,HttpException } from '@nestjs/common';
import { CreateEmployeDto } from './dto/create-employe.dto';
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

 async findActive():Promise<Employe[]> {
  try {
    return await this.employeModel.find({is_actif: true})
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
}
