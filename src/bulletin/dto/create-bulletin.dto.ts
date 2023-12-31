import { IsMongoId, IsObject } from "class-validator";

export class CreateBulletinDto {
    @IsMongoId()
    employe: string;

    @IsMongoId()
    lot: string;

    @IsObject()
    lignes: object;
}
