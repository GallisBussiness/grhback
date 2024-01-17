import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Employe } from "src/employe/entities/employe.entity";
import { Lot } from "src/lot/entities/lot.entity";

export type BulletinDocument = HydratedDocument<Bulletin>

@Schema({timestamps: true})
export class Bulletin {

    @Prop({type: Types.ObjectId,ref: Employe.name,required: true,autopopulate: true})
    employe: string | Employe

    @Prop({type: Types.ObjectId,ref: Lot.name,required: true,autopopulate: {maxDepth: 2}})
    lot: Lot | string 

    @Prop({type: Object, required: true})
    lignes: object
}

export const bulletinSchema = SchemaFactory.createForClass(Bulletin);
