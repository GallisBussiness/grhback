import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LotDocument = HydratedDocument<Lot>

@Schema({timestamps: true})
export class Lot {
    @Prop()
    libelle: string;

    @Prop()
    debut:string;

    @Prop()
    fin: string;
}

export const LotSchema = SchemaFactory.createForClass(Lot);