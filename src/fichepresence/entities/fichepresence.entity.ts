import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type FichepresenceDocument = Fichepresence & Document;

@Schema({timestamps: true})
export class Fichepresence {
    @Prop({type: String, required: true})
    date: string;

    @Prop({type: Boolean, required: true, default: true})
    isOpen: boolean;

    @Prop({type: String})
    description: string;

    @Prop({type: String, default: uuidv4()})
    code: string;

    @Prop({type: String})
    ref: string;
}



export const FichepresenceSchema = SchemaFactory.createForClass(Fichepresence)