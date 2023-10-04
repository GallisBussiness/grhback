import { IsBoolean,IsOptional, IsString } from "class-validator";

export class CreateFichepresenceDto {
   
    @IsString()
    date: Date;

    @IsOptional()
    @IsBoolean()
    isOpen: boolean;

    @IsString()
    description: string;
}
