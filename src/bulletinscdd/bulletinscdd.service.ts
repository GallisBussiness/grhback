import { Injectable } from '@nestjs/common';
import { CreateBulletinscddDto } from './dto/create-bulletinscdd.dto';
import { UpdateBulletinscddDto } from './dto/update-bulletinscdd.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Bulletinscdd, BulletinscddDocument } from './entities/bulletinscdd.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BulletinscddService extends AbstractModel<Bulletinscdd,CreateBulletinscddDto,UpdateBulletinscddDto>{
  constructor(@InjectModel(Bulletinscdd.name) private readonly bulletinscddModel: Model<BulletinscddDocument>){
   super(bulletinscddModel);
  } 
 }
