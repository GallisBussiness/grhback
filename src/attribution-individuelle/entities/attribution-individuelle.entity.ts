import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Employe } from "src/employe/entities/employe.entity";
import { Rubrique } from "src/rubrique/entities/rubrique.entity";

@Schema({timestamps: true})
export class AttributionIndividuelle {
    @Prop({type: Types.ObjectId,ref: Employe.name,required: true})
    employe: string;

    @Prop({type: Types.ObjectId,ref: Rubrique.name,required: true})
    rubrique: string;

    @Prop({type:Number,required: true,default:0})
    valeur_par_defaut: number;
}

export const AttributionIndividuelleSchema = SchemaFactory.createForClass(AttributionIndividuelle);