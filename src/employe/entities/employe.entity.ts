import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type EmployeDocument = Employe & Document;

@Schema({timestamps: true})
export class Employe {
   
    @Prop({type:String, required: true})
    prenom: string;

    @Prop({type:String, required: true})
    nom: string;

    @Prop({type: String, default: uuidv4()})
    code: string;

    @Prop({type:String, required: true})
    qualification: string;

    @Prop({type:String, required: true})
    date_de_recrutement: string;

    @Prop({type:String, required: true})
    telephone: string;

    @Prop({type:String, required: true})
    adresse: string;

    @Prop({type:String, required: true})
    poste: string;

    @Prop({type:String, required: true})
    nationalite: string;

    @Prop({type:String, required: true})
    nci: string;

    @Prop({type:String, required: true})
    npp: string;

    @Prop({type:String, required: true})
    matricule_de_solde: string;

    @Prop({type:String, required: true})
    genre: string;

    @Prop({type:String, required: true})
    civilite: string;

    @Prop({type:Number, required: true})
    nombre_de_parts: number;

    @Prop({type:String, required: true})
    date_de_naissance: string;

    @Prop({type:String, required: true})
    lieu_de_naissance: string;

    @Prop({type:String, required: true})
    profile: string;

    @Prop({type:Number, required: true})
    categorie: number;

    @Prop({type:Number, required: true, default: 1})
    is_actif: number;
}


export const  EmployeSchema = SchemaFactory.createForClass(Employe);