import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Division } from "src/division/entities/division.entity";

export type ServiceDocument = HydratedDocument<Service>;

@Schema({timestamps: true})
export class Service {
 @Prop({type: String, required: true})
 nom: string;

 @Prop({type: Types.ObjectId,ref: Division.name,required: true})
 division: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);