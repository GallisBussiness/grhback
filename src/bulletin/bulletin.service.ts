import { Injectable } from '@nestjs/common';
import { CreateBulletinDto } from './dto/create-bulletin.dto';
import { UpdateBulletinDto } from './dto/update-bulletin.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Bulletin, BulletinDocument } from './entities/bulletin.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BulletinService extends AbstractModel<Bulletin,CreateBulletinDto,UpdateBulletinDto>{
 constructor(@InjectModel(Bulletin.name) private readonly bulletinModel: Model<BulletinDocument>){
  super(bulletinModel);
 } 
}
