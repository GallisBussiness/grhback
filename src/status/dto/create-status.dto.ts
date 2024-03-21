import { IsString } from "class-validator";

export class CreateStatusDto {
    @IsString()
    nom: string;
}
