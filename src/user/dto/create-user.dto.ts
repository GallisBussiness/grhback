import { IsEnum, IsOptional, IsString } from 'class-validator';
import { USER_ROLE } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsOptional()
  @IsEnum(USER_ROLE, { each: true })
  role: USER_ROLE;
}
