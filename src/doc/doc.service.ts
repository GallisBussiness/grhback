import { HttpException, Injectable } from '@nestjs/common';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Doc, DocDocument } from './entities/doc.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DocService extends AbstractModel<Doc,CreateDocDto,UpdateDocDto>{
 constructor(@InjectModel(Doc.name) private readonly docModel: Model<DocDocument>){
  super(docModel);
 }

 async findByEmp (emp: string): Promise<Doc[]> {
  try {
    return this.docModel.find({employe:emp})
  } catch (error) {
    throw new HttpException(error.message,500);
  }
 }
}
