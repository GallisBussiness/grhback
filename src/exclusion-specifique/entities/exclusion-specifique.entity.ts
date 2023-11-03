import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Employe } from "src/employe/entities/employe.entity";
import { Rubrique } from "src/rubrique/entities/rubrique.entity";

export type ExclusionSpecifiqueDocument = HydratedDocument<ExclusionSpecifique>;

@Schema({timestamps: true})
export class ExclusionSpecifique {
    @Prop({type: Types.ObjectId,ref: Employe.name,required: true})
    employe: string;

    @Prop({type: Types.ObjectId,ref: Rubrique.name,required: true,autopopulate: true})
    rubrique: string;

    @Prop({type: String})
    description: string;
}

export const ExclusionSpecifiqueSchema = SchemaFactory.createForClass(ExclusionSpecifique);
