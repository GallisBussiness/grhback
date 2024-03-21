import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { Employe } from "src/employe/entities/employe.entity";
import { Lotscdd } from "src/lotscdd/entities/lotscdd.entity"

export type BulletinscddDocument = HydratedDocument<Bulletinscdd>;

@Schema({timestamps: true})
export class Bulletinscdd {
    @Prop({type: Types.ObjectId,ref:  Employe.name,required: true,autopopulate: true})
    employe: string | Employe

    @Prop({type: Types.ObjectId,ref: Lotscdd.name,required: true,autopopulate: {maxDepth: 2}})
    lot: Lotscdd | string 

    @Prop({type: Object, required: true})
    lignes: object
}


export const bulletinscddSchema = SchemaFactory.createForClass(Bulletinscdd);