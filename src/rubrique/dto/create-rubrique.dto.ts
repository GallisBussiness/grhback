import { IsMongoId, IsNumber, IsString } from "class-validator";

export class CreateRubriqueDto {
    @IsString()
     libelle: string;

    @IsNumber()
    code: string;

    @IsMongoId()
    section: string;
}
