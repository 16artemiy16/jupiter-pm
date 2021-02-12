import { Module } from '@nestjs/common';
import { Board, BoardSchema } from "./schemas/board.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardsService } from "./boards.service";
import { BoardsController } from "./boards.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema }
    ]),
  ],
  providers: [
    BoardsService
  ],
  controllers: [
    BoardsController
  ]
})
export class BoardsModule {}
