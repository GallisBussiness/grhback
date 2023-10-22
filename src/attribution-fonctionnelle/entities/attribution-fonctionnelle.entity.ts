import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Fonction } from "src/fonction/entities/fonction.entity";
import { Rubrique } from "src/rubrique/entities/rubrique.entity";

export type AttributionFonctionnelleDocument = HydratedDocument<AttributionFonctionnelle>;

@Schema({timestamps: true})
export class AttributionFonctionnelle {
    @Prop({type: Types.ObjectId,ref: Fonction.name, required: true})
    fonction: string;

    @Prop({type: Types.ObjectId,ref: Rubrique.name, required: true})
    rubrique: string;

    @Prop({type: Number, required: true, default: 0})
    valeur_par_defaut: number;
}

export const AttributionFonctionnelleSchema = SchemaFactory.createForClass(AttributionFonctionnelle);