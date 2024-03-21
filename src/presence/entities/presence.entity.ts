import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TYPEPRESENCE } from "../dto/create-presence.dto";
import { Employe } from "src/employe/entities/employe.entity";
import { Fichepresence } from "src/fichepresence/entities/fichepresence.entity";

export type PresenceDocument = Presence & Document;

@Schema({timestamps: true})
export class Presence {
    _id: string;
    
    @Prop({type: String, enum: TYPEPRESENCE, required: true})
    type: string;

    @Prop({type: Date, required: true, default: Date.now})
     heure: string;

     @Prop({type: Types.ObjectId, ref: Employe.name, required: true, autopopulate: true})
     employe: Employe;

     @Prop({type: Types.ObjectId, ref: Fichepresence.name, required: true,autopopulate: true})
     fiche: string;
}


export const PresenceSchema = SchemaFactory.createForClass(Presence);
