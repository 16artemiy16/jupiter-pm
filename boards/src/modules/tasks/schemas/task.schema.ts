import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TaskDocument = Task & Document;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
})
export class Task {
  @Prop({ required: true })
  column: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  creator: string;

  @Prop()
  assignee: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ title: 1 });