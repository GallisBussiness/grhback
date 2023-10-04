import { PartialType } from '@nestjs/mapped-types';
import { CreateFichepresenceDto } from './create-fichepresence.dto';

export class UpdateFichepresenceDto extends PartialType(CreateFichepresenceDto) {}
