import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';
import { BoardUserI } from "../interfaces/board-users.interface";
import { BoardUserRole } from "../enums/board-user-role.enum";
import { Column } from "./column.schema";

export type BoardDocument = Board & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Board {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  creator: string;

  @Prop({
    default: [],
    type: [{
      user: { type: String },
      role: { type: String, enum: Object.values(BoardUserRole) }
    }]
  })
  users: BoardUserI[];

  @Prop({
    type: [{
      required: true,
      type: MSchema.Types.ObjectId,
      ref: Column.name
    }]
  })
  columns: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
BoardSchema.index({ title: 1 });