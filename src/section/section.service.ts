import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Section, SectionDocument } from './entities/section.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SectionService extends AbstractModel<Section,CreateSectionDto,UpdateSectionDto>{
  constructor(@InjectModel(Section.name) private readonly sectionModel: Model<SectionDocument>){
    super(sectionModel);
  }
}
