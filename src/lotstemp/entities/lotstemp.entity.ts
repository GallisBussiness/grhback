import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import exp from "constants";
import { HydratedDocument } from "mongoose";

export type LotsTempDocument = HydratedDocument<Lotstemp>

export enum StateLotsTemp {
    BROUILLON = 'BROUILLON',
    WAITING = 'EN COURS DE VALIDATION',
    VALIDE = 'VALIDE'
}

@Schema({timestamps: true})
export class Lotstemp {
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

    @Prop({type: String,required: true,enum:StateLotsTemp,default:StateLotsTemp.BROUILLON})
    etat: StateLotsTemp;
}


export const LotsTempSchema = SchemaFactory.createForClass(Lotstemp);