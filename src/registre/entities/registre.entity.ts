import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument,} from "mongoose";
import { Bulletin, bulletinSchema} from "src/bulletin/entities/bulletin.entity";

export type RegistreDocument = HydratedDocument<Registre>;

@Schema({timestamps: true})
export class Registre {
  _id: string;
  @Prop({type: Number,required: true})
  annee: number;

  @Prop({type: String,required: true})
  lot: string;

  @Prop({type: Number,required: true})
  mois: number;

  @Prop({type: [bulletinSchema],required: true})
  bulletins: Bulletin[];
}


export const RegistreSchema = SchemaFactory.createForClass(Registre);