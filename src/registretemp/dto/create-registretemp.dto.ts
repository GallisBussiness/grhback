import { IsNumber, IsString } from "class-validator";

export class CreateRegistretempDto {
    @IsNumber()
    annee: number;

    @IsNumber()
    mois: number;

    @IsString()
    lot:string;

    @IsNumber()
    total: number;
}
