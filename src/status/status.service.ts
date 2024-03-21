import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Status, StatusDocument } from './entities/status.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StatusService extends AbstractModel<Status,CreateStatusDto,UpdateStatusDto>{
  constructor(@InjectModel(Status.name) private readonly statusModel: Model<StatusDocument>){
    super(statusModel);
  }
  
}
