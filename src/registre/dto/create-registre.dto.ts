import { IsNumber, IsObject } from "class-validator";
import { Bulletin } from "src/bulletin/entities/bulletin.entity";

export class CreateRegistreDto {
    @IsNumber()
    annee: number;

    @IsNumber()
    mois: number;

    @IsObject()
    bulletins: Bulletin[];
}
