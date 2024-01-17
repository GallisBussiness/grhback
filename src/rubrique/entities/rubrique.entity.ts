import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import { Section } from "src/section/entities/section.entity";

export type RubriqueDocument = HydratedDocument<Rubrique>;

@Schema({timestamps: true})
export class Rubrique {

_id:string;

@Prop({type: String,required: true})
libelle:string;

@Prop({type: Number,required: true,unique:true})
code:number;

@Prop({type: Types.ObjectId, required: true,ref: Section.name, autopopulate: {maxDepth: 2}})
@Type(() => Section)
section: Section;
}
export const RubriqueSchema = SchemaFactory.createForClass(Rubrique);