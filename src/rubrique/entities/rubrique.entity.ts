import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Section } from "src/section/entities/section.entity";

export type RubriqueDocument = HydratedDocument<Rubrique>;

@Schema({timestamps: true})
export class Rubrique {
@Prop({type: String,required: true})
libelle:string;

@Prop({type: String,required: true})
code:string;

@Prop({type: Types.ObjectId, required: true,ref: Section.name})
section: string;
}
export const RubriqueSchema = SchemaFactory.createForClass(Rubrique);