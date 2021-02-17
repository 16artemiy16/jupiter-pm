import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BoardUserI } from "../interfaces/board-users.interface";
import { BoardUserRole } from "../enums/board-user-role.enum";

export type BoardDocument = Board & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
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
    default: [],
    type: [{
      name: String,
      /**
       * If true then the newly created tasks will be placed in this column.
       * Should be only one true among all the board columns.
       **/
      isSpawn: { type: Boolean, default: false },
    }]
  })
  columns: any[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.index({ title: 1 });