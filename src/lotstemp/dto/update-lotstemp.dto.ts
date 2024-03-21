import { PartialType } from '@nestjs/mapped-types';
import { CreateLotstempDto } from './create-lotstemp.dto';

export class UpdateLotstempDto extends PartialType(CreateLotstempDto) {}
