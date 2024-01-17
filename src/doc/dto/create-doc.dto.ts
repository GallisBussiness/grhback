import { IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateDocDto {
    @IsString()
    nom: string;

    @IsOptional()
    @IsString()
    chemin: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsMongoId()
    employe: string;
}
