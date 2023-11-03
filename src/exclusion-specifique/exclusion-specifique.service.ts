import { HttpException, Injectable } from '@nestjs/common';
import { CreateExclusionSpecifiqueDto } from './dto/create-exclusion-specifique.dto';
import { UpdateExclusionSpecifiqueDto } from './dto/update-exclusion-specifique.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { ExclusionSpecifique, ExclusionSpecifiqueDocument } from './entities/exclusion-specifique.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExclusionSpecifiqueService extends AbstractModel<ExclusionSpecifique,CreateExclusionSpecifiqueDto,UpdateExclusionSpecifiqueDto>{
  constructor(@InjectModel(ExclusionSpecifique.name) private readonly exclusionSpecifiqueModel: Model<ExclusionSpecifiqueDocument>){
    super(exclusionSpecifiqueModel);
  }

  async findOneByEmploye(emp: string):Promise<ExclusionSpecifique[]> {
    try {
      return this.exclusionSpecifiqueModel.find({employe: emp});
    } catch (error) {
      throw new HttpException(error.message,500)
    }
  }
}
