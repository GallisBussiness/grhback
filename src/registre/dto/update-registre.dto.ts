import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistreDto } from './create-registre.dto';

export class UpdateRegistreDto extends PartialType(CreateRegistreDto) {}
