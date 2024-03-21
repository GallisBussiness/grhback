import { PartialType } from '@nestjs/mapped-types';
import { CreateLotscddDto } from './create-lotscdd.dto';

export class UpdateLotscddDto extends PartialType(CreateLotscddDto) {}
