import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FigurationDocument = HydratedDocument<Figuration>

@Schema()
export class Figuration {
   
    @Prop({type: Number,required: true,default:0})
    montant: number

    @Prop({type: Number,required: true,default:0})
    taux1: number

    @Prop({type: Number,required: true,default:0})
    taux2: number

    @Prop({type: Number,required: true,default:0})
    base: number

    @Prop({type: Object,required:true})
    rubrique: object;
}

export const FigurationSchema = SchemaFactory.createForClass(Figuration);