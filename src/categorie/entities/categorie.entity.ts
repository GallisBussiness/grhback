import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CategorieDocument = HydratedDocument<Categorie>;

@Schema({timestamps: true})
export class Categorie {
    @Prop({type: Number,required:true})
    code:number;

    @Prop({type: Number,required: true})
    valeur: number;

}

export const CategorieSchema = SchemaFactory.createForClass(Categorie);