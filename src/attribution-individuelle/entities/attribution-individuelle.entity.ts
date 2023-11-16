import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Types } from "mongoose";
import { Employe } from "src/employe/entities/employe.entity";
import { Rubrique } from "src/rubrique/entities/rubrique.entity";

@Schema({timestamps: true})
export class AttributionIndividuelle {
    @Prop({type: Types.ObjectId,ref: Employe.name,required: true})
    employe: string;

    @Prop({type: Types.ObjectId,ref: Rubrique.name,required: true,autopopulate: {maxDepth: 2}})
    @Type(() => Rubrique)
    rubrique: Rubrique;

    @Prop({type:Number,required: true,default:0})
    valeur_par_defaut: number;
}

export const AttributionIndividuelleSchema = SchemaFactory.createForClass(AttributionIndividuelle).index({'employe': 1, 'rubrique': 1}, {unique: true});;