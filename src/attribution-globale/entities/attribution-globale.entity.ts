import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Fonction } from "src/fonction/entities/fonction.entity";
import { Rubrique } from "src/rubrique/entities/rubrique.entity";

export type AttributionGlobaleDocument = HydratedDocument<AttributionGlobale>;

@Schema({timestamps: true})
export class AttributionGlobale {
   
    @Prop({type: Types.ObjectId,ref: Rubrique.name, required: true})
    rubrique: string;

    @Prop({type: Number, required: true, default: 0})
    valeur_par_defaut: number;

    @Prop({type: String})
    regle: string;
}

export const AttributionGlobaleSchema = SchemaFactory.createForClass(AttributionGlobale);