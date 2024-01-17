import {IsString } from "class-validator";

export class CreateSectionDto {
    @IsString()
    nom: string;
}
