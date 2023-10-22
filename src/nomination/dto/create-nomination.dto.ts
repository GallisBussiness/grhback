import { IsBoolean, IsDateString, IsMongoId, IsOptional, IsString, Max } from "class-validator";

export class CreateNominationDto {
    @IsDateString()
    date: string;

    @IsString()
    @Max(255)
    description: string;

    @IsOptional()
    @IsBoolean()
    est_active: boolean;

    @IsMongoId()
    employe: string;

    @IsMongoId()
    fonction: string;
}
