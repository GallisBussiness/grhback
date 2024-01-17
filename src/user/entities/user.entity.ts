import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum USER_ROLE {
  CSA = 'csa',
  RH = 'rh',
  ADMIN = 'admin',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: string;

  @Prop({ type: String, unique: true, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  prenom: string;

  @Prop({ type: String, required: true })
  nom: string;

  @Prop({ type: String })
  resetPasswordToken: string;

  @Prop({ type: String, default: USER_ROLE.RH })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
