import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import isEmail from '../utils/is-email.util';
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    validate: [isEmail, 'The format is incorrect']
  })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });