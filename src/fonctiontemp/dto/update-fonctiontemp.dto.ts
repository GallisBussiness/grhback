import { PartialType } from '@nestjs/mapped-types';
import { CreateFonctiontempDto } from './create-fonctiontemp.dto';

export class UpdateFonctiontempDto extends PartialType(CreateFonctiontempDto) {}
