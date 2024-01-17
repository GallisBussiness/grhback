import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export enum TypeTemp {
    PRESTATAIRE = 'PRESTATAIRE',
    CDD = 'CDD',
    STAGIAIRE = 'STAGIAIRE'
}

export class CreateTemporaireDto {
    @IsString()
    prenom: string;


    @IsOptional()
    @IsString()
    code: string;

    @IsString()
    nom: string;

    @IsString()
    date_de_recrutement: string;

    @IsString()
    telephone: string;

    @IsString()
    adresse: string;

    @IsMongoId()
    fonctionTemp: string;

    @IsString()
    nationalite: string;

    @IsString()
    nci: string;

    @IsString()
    npp: string;

    @IsString()
    genre: string;

    @IsString()
    civilite: string;

    @IsString()
    date_de_naissance: string;

    @IsString()
    date_de_fin_de_contrat: string;

    @IsString()
    lieu_de_naissance: string;

    @IsOptional()
    @IsString()
    profile: string;

    @IsNumber()
    mensualite: number;

    @IsEnum(TypeTemp)
    type: string;
}
