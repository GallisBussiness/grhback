import { IsString } from "class-validator";

export class MonthDto {
    @IsString()
    mois: string;

    @IsString()
    annee: string;
}