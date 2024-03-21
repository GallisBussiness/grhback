import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrecddDto } from './create-registrecdd.dto';

export class UpdateRegistrecddDto extends PartialType(CreateRegistrecddDto) {}
