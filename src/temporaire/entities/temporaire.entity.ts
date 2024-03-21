import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { format } from "date-fns";
import { HydratedDocument, Types } from "mongoose";
import { Status } from "src/status/entities/status.entity";

export type TemporaireDocument = HydratedDocument<Temporaire>

@Schema({timestamps:true})
export class Temporaire {
    
    _id:string;

    @Prop({type:String, required: true})
    prenom: string;

    @Prop({type:String, required: true})
    nom: string;

    @Prop({type:Types.ObjectId,ref: Status.name, required: true, autopopulate: true})
    status: Status;

    @Prop({type:String, required: true})
    nci: string;

    @Prop({type:String, required: true})
    genre: string;

    @Prop({type:Number,required: true})
    mensualite: number;
}

export const TemporaireSchema = SchemaFactory.createForClass(Temporaire);