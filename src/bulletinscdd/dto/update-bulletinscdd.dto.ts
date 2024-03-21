import { PartialType } from '@nestjs/mapped-types';
import { CreateBulletinscddDto } from './create-bulletinscdd.dto';

export class UpdateBulletinscddDto extends PartialType(CreateBulletinscddDto) {}
