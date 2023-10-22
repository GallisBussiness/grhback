import { IsMongoId, IsString } from "class-validator";

export class CreateRubriqueDto {
    @IsString()
     libelle: string;

    @IsString()
    code: string;

    @IsMongoId()
    section: string;
}
