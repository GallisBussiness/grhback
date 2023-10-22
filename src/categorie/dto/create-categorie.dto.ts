import { IsNumber, IsString } from "class-validator";

export class CreateCategorieDto {
    @IsNumber()
    code:number;

    @IsNumber()
    valeur: number;

}
