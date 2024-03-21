import { IsNumber, IsObject, IsString } from "class-validator";
import { Bulletinscdd } from "src/bulletinscdd/entities/bulletinscdd.entity";

export class CreateRegistrecddDto {
    @IsNumber()
    annee: number;

    @IsNumber()
    mois: number;

    @IsString()
    lot:string;

    @IsObject()
    bulletins: Bulletinscdd[];
}
