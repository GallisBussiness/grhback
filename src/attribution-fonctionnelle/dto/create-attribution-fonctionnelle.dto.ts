import { IsMongoId, IsNumber } from "class-validator";

export class CreateAttributionFonctionnelleDto {
    @IsMongoId()
    fonction: string;

    @IsMongoId()
    rubrique: string;

    @IsNumber()
    valeur_par_defaut: number;
}
