import { IsBoolean,IsOptional, IsString } from "class-validator";

export class CreateFichepresenceDto {
   
    @IsString()
    date: string;

    @IsString()
    mois: string;

    @IsString()
    annee: string;

    @IsOptional()
    @IsBoolean()
    isOpen?: boolean;

    @IsString()
    description: string;
}
