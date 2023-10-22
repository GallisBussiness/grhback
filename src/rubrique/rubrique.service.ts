import { Injectable } from '@nestjs/common';
import { CreateRubriqueDto } from './dto/create-rubrique.dto';
import { UpdateRubriqueDto } from './dto/update-rubrique.dto';

@Injectable()
export class RubriqueService {
  create(createRubriqueDto: CreateRubriqueDto) {
    return 'This action adds a new rubrique';
  }

  findAll() {
    return `This action returns all rubrique`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rubrique`;
  }

  update(id: number, updateRubriqueDto: UpdateRubriqueDto) {
    return `This action updates a #${id} rubrique`;
  }

  remove(id: number) {
    return `This action removes a #${id} rubrique`;
  }
}
