import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEmployeDto {
    @IsString()
    prenom: string;


    @IsOptional()
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    password: string;


    @IsString()
    nom: string;

    @IsString()
    qualification: string;

    @IsString()
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

    @IsString()
    date_de_naissance: string;

    @IsString()
    lieu_de_naissance: string;

    @IsOptional()
    @IsString()
    profile: string;

    @IsMongoId()
    categorie: string;
}
