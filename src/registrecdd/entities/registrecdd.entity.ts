import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Bulletinscdd, bulletinscddSchema } from "src/bulletinscdd/entities/bulletinscdd.entity";


export type RegistrecddDocument = HydratedDocument<Registrecdd>;

@Schema({timestamps: true})
export class Registrecdd {
    _id: string;
    @Prop({type: Number,required: true})
    annee: number;
  
    @Prop({type: String,required: true})
    lot: string;
  
    @Prop({type: Number,required: true})
    mois: number;
  
    @Prop({type: [bulletinscddSchema],required: true})
    bulletins: Bulletinscdd[];
}


export const RegistrecddSchema = SchemaFactory.createForClass(Registrecdd);