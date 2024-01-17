import { IsString } from "class-validator";

export class CreateFonctiontempDto {
    @IsString()
    nom: string
}
