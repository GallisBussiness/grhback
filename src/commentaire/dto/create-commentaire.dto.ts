import { IsDateString, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentaireDto {

    @IsNotEmpty()
    @IsMongoId()
    auteur: string;

    @IsNotEmpty()
    @IsMongoId()
    lot: string;

    @IsNotEmpty()
    @IsString()
    contenu: string;
}
