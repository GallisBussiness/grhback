import { Optional } from "@nestjs/common";
import { IsBoolean, IsDateString, IsMongoId, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateEmployeDto {
    @IsString()
    prenom: string;


    @IsOptional()
    @IsString()
    code: string;


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

    @Optional()
    @IsString()
    profile: string;

    @IsMongoId()
    categorie: string;

    @IsNumber()
    is_actif: number;
}
