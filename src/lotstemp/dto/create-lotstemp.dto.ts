import { IsOptional, IsString } from "class-validator";

export class CreateLotstempDto {
    @IsString()
    libelle: string;

    @IsString()
    debut:string;

    @IsString()
    fin: string;

    @IsOptional()
    @IsString()
    etat: string;
}
