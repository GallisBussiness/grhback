import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SectionDocument = HydratedDocument<Section>;

@Schema({timestamps: true})
export class Section {
    _id: string

    @Prop({type: String, required: true})
    nom: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);