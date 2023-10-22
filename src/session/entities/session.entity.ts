import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SessionDocument = HydratedDocument<Session>;

@Schema({timestamps: true})
export class Session {
    _id: string

    @Prop({type: String, required: true})
    nom: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);