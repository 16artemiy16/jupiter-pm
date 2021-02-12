import { Module } from '@nestjs/common';
import { Board, BoardSchema } from "./schemas/board.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardsService } from "./services/boards.service";
import { BoardsController } from "./boards.controller";
import { Column, ColumnSchema } from "./schemas/column.schema";
import { ColumnsService } from "./services/columns.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: Column.name, schema: ColumnSchema }
    ]),
  ],
  providers: [
    BoardsService,
    ColumnsService
  ],
  controllers: [
    BoardsController
  ]
})
export class BoardsModule {}
