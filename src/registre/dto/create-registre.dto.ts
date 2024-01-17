import { IsNumber, IsObject, IsString } from "class-validator";
import { Bulletin } from "src/bulletin/entities/bulletin.entity";

export class CreateRegistreDto {
    @IsNumber()
    annee: number;

    @IsNumber()
    mois: number;

    @IsString()
    lot:string;

    @IsObject()
    bulletins: Bulletin[];
}
