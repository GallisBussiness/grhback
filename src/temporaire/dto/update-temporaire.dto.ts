import { PartialType } from '@nestjs/mapped-types';
import { CreateTemporaireDto } from './create-temporaire.dto';

export class UpdateTemporaireDto extends PartialType(CreateTemporaireDto) {}
