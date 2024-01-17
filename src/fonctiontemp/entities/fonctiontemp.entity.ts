import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FonctiontempDocument = HydratedDocument<Fonctiontemp>

@Schema({timestamps: true})
export class Fonctiontemp {
    _id: string

    @Prop({type: String, required: true})
    nom: string;
}

export const FonctiontempSchema = SchemaFactory.createForClass(Fonctiontemp);