import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LotscddDocument = HydratedDocument<Lotscdd>

export enum StateLotscdd {
    BROUILLON = 'BROUILLON',
    WAITING = 'EN COURS DE VALIDATION',
    VALIDE = 'VALIDE'
}

@Schema({timestamps: true})
export class Lotscdd {
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

    @Prop({type: String,required: true,enum:StateLotscdd,default:StateLotscdd.BROUILLON})
    etat: StateLotscdd;
}


export const LotscddSchema = SchemaFactory.createForClass(Lotscdd);
