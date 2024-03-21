import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Lot } from "src/lot/entities/lot.entity";
import { User } from "src/user/entities/user.entity";

export  type CommentaireDocument = HydratedDocument<Commentaire>;

@Schema({timestamps: true})
export class Commentaire {

    _id: string;

    @Prop({type: Types.ObjectId,ref: User.name,required: true, autopopulate: true})
    auteur: User;

    @Prop({type: Types.ObjectId,ref: Lot.name,required: true, autopopulate: true})
    lot: Lot;

    @Prop({type: String})
    contenu: string;
}

export const CommentaireSchema = SchemaFactory.createForClass(Commentaire);
