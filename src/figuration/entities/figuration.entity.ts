import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Rubrique } from "src/rubrique/entities/rubrique.entity";

export type FigurationDocument = HydratedDocument<Figuration>

@Schema()
export class Figuration {
    @Prop({type: Types.ObjectId,ref: Rubrique.name,required:true})
    rubrique: Rubrique  | string;

    @Prop({type: Number,required: true,default:0})
    montant: number

    @Prop({type: Number,required: true,default:0})
    taux1: number

    @Prop({type: Number,required: true,default:0})
    taux2: number

    @Prop({type: Number,required: true,default:0})
    base: number
}

export const FigurationSchema = SchemaFactory.createForClass(Figuration);