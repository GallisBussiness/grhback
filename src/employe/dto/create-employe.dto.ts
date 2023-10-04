import { IsBoolean, IsDateString, IsMongoId, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateEmployeDto {
    @IsString()
    prenom: string;

    @IsString()
    nom: string;

    @IsString()
    qualification: string;

    @IsDateString()
    date_de_recrutement: string;

    @IsString()
    telephone: string;

    @IsString()
    adresse: string;

    @IsString()
    poste: string;

    @IsString()
    nationalite: string;

    @IsString()
    nci: string;

    @IsString()
    npp: string;

    @IsString()
    matricule_de_solde: string;

    @IsString()
    genre: string;

    @IsString()
    civilite: string;

    @IsNumber()
    nombre_de_parts: number;

    @IsDateString()
    date_de_naissance: string;

    @IsString()
    lieu_de_naissance: string;

    @IsString()
    profile: string;

    @IsNumber()
    categorie: number;

    @IsNumber()
    is_actif: number;
}