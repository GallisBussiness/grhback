import { IsMongoId, IsNumber, IsString } from "class-validator";

export class CreateTemporaireDto {
    @IsString()
    prenom: string;

    @IsString()
    nom: string;

    @IsMongoId()
    status: string;

    @IsString()
    nci: string;

    @IsString()
    genre: string;

    @IsNumber()
    mensualite: number;

}
