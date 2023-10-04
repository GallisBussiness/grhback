import { IsEnum, IsMongoId, IsString } from "class-validator";

export enum TYPEPRESENCE {
    ARRIVEE = "ARRIVEE",
    DEPART = "DEPART"
}

export class CreatePresenceDto {
   
     @IsMongoId()
     employe: string;

     @IsMongoId()
     fiche: string;
}
