import { IsMongoId, IsNumber, IsString } from "class-validator";

export class CreateAttributionGlobaleDto {
  
    @IsMongoId()
    rubrique: string;

    @IsNumber()
    valeur_par_defaut: number;

    @IsString()
    regle: string;
}
