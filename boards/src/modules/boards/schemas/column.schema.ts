import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type ColumnDocument = Column & Document;

@Schema()
export class Column {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  board: string;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);