import { Injectable } from '@nestjs/common';
import { CreateFonctiontempDto } from './dto/create-fonctiontemp.dto';
import { UpdateFonctiontempDto } from './dto/update-fonctiontemp.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Fonctiontemp, FonctiontempDocument } from './entities/fonctiontemp.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FonctiontempService extends AbstractModel<Fonctiontemp,CreateFonctiontempDto,UpdateFonctiontempDto>{
 constructor(@InjectModel(Fonctiontemp.name) private readonly fonctionTempModel: Model<FonctiontempDocument>){
  super(fonctionTempModel);
 }
}
