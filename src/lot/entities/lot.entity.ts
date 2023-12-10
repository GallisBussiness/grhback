import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LotDocument = HydratedDocument<Lot>

@Schema({timestamps: true})
export class Lot {

    _id: string;

    @Prop({type: String,required: true})
    libelle: string;

    @Prop({type: String,required: true})
    debut:string;

    @Prop({type: String,required: true})
    fin: string;

    @Prop({type: Number,required: true})
    annee: number;

    @Prop({type:Number,required: true})
    mois:number;
}

export const LotSchema = SchemaFactory.createForClass(Lot);