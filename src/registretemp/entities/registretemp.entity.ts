import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RegistretempDocument = HydratedDocument<Registretemp>;

@Schema({timestamps: true})
export class Registretemp {
    _id: string;
    @Prop({type: Number,required: true})
    annee: number;
  
    @Prop({type: String,required: true})
    lot: string;
  
    @Prop({type: Number,required: true})
    mois: number;

    @Prop({type: Number,required: true})
    total: number;
}


export const RegistretempSchema = SchemaFactory.createForClass(Registretemp);