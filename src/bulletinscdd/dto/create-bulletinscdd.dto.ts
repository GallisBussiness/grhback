import { IsMongoId, IsObject } from "class-validator";

export class CreateBulletinscddDto {
    @IsMongoId()
    employe: string;

    @IsMongoId()
    lot: string;

    @IsObject()
    lignes: object;
}
