import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { format } from "date-fns";
import { HydratedDocument, Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { TypeTemp } from "../dto/create-temporaire.dto";
import { Fonctiontemp } from "src/fonctiontemp/entities/fonctiontemp.entity";

export type TemporaireDocument = HydratedDocument<Temporaire>

@Schema({timestamps:true})
export class Temporaire {
    
    _id:string;

    @Prop({type:String, required: true})
    prenom: string;

    @Prop({type:String, required: true})
    nom: string;

    @Prop({type: String, default: uuidv4})
    code: string;

    @Prop({type:String, required: true,set:(v: string) => format(new Date(v),"yyyy-MM-dd")})
    date_de_recrutement: string;

    @Prop({type:String, required: true,set:(v: string) => format(new Date(v),"yyyy-MM-dd")})
    date_de_fin_de_contrat: string;

    @Prop({type:String, required: true})
    telephone: string;

    @Prop({type:String, required: true})
    adresse: string;

    @Prop({type:Types.ObjectId,ref: Fonctiontemp.name, required: true, autopopulate: true})
    fonctionTemp: string;

    @Prop({type:String, required: true})
    nationalite: string;

    @Prop({type:String, required: true})
    nci: string;

    @Prop({type:String, required: true})
    npp: string;

    @Prop({type:String, required: true})
    genre: string;

    @Prop({type:String, required: true})
    civilite: string;


    @Prop({type:String, required: true,set:(v: string) => format(new Date(v),"yyyy-MM-dd")})
    date_de_naissance: string;

    @Prop({type:String, required: true})
    lieu_de_naissance: string;

    @Prop({type:String})
    profile: string;

    @Prop({type:Number,required: true})
    mensualite: number;

    @Prop({type:String, enum:TypeTemp, required: true})
    type: string;

    @Prop({type:Number, required: true, default: true})
    is_actif: number;
}

export const TemporaireSchema = SchemaFactory.createForClass(Temporaire);