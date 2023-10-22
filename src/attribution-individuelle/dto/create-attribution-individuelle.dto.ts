import { IsMongoId, IsNumber, IsString } from "class-validator";

export class CreateAttributionIndividuelleDto {

    @IsMongoId()
    employe: string;

    @IsMongoId()
    rubrique: string;

    @IsNumber()
    valeur_par_defaut: number;
}
