import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistretempDto } from './create-registretemp.dto';

export class UpdateRegistretempDto extends PartialType(CreateRegistretempDto) {}
