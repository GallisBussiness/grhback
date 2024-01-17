import { IsBoolean, IsMongoId, IsOptional, IsString, Max } from "class-validator";

export class CreateNominationDto {
    @IsString()
    date: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    est_active: boolean;

    @IsMongoId()
    employe: string;

    @IsMongoId()
    fonction: string;

    @IsMongoId()
    division: string;

    @IsMongoId()
    @IsOptional()
    service: string;
}
