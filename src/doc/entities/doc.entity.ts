import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Employe } from "src/employe/entities/employe.entity";

export type DocDocument = HydratedDocument<Doc>;

@Schema({timestamps: true})
export class Doc {
    @Prop({type: String,required: true})
    nom: string;

    @Prop({type: String})
    description: string;

    @Prop({type: Types.ObjectId,ref: Employe.name,required: true})
    employe: string;

    @Prop({type: String,required: true})
    chemin: string;
}

export const DocSchema = SchemaFactory.createForClass(Doc);