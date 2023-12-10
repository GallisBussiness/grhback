import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Rubrique } from "src/rubrique/entities/rubrique.entity";

export type AttributionGlobaleDocument = HydratedDocument<AttributionGlobale>;

@Schema({timestamps: true})
export class AttributionGlobale {
    
    _id: string;

    @Prop({type: Types.ObjectId,ref: Rubrique.name, required: true, autopopulate: {maxDepth:2},unique: true})
    rubrique: Rubrique;

    @Prop({type: Number, required: true, default: 0})
    valeur_par_defaut: number;

    @Prop({type: String})
    regle: string;
}

export const AttributionGlobaleSchema = SchemaFactory.createForClass(AttributionGlobale);