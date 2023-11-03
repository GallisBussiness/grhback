import { IsString } from "class-validator";

export class CreateLotDto {
    @IsString()
    libelle: string;

    @IsString()
    debut:string;

    @IsString()
    fin: string;
}
