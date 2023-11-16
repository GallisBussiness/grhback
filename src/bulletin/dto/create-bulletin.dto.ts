import { IsMongoId } from "class-validator";

export class CreateBulletinDto {
    @IsMongoId()
    employe: string;

    @IsMongoId()
    lot: string;
}
