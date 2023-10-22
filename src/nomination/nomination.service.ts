import { Injectable } from '@nestjs/common';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { UpdateNominationDto } from './dto/update-nomination.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Nomination, NominationDocument } from './entities/nomination.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NominationService extends AbstractModel<Nomination,CreateNominationDto,UpdateNominationDto>{
  constructor(@InjectModel(Nomination.name) private readonly nominationModel: Model<NominationDocument>){
    super(nominationModel);
  }
}
