import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StatusDocument  = HydratedDocument<Status>

@Schema({timestamps: true})
export class Status {
    _id: string;
    
    @Prop({type: String,required: true,unique: true})
    nom: string;
}

export  const StatusSchema = SchemaFactory.createForClass(Status);