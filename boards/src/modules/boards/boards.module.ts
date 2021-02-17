import { Module } from '@nestjs/common';
import { Board, BoardSchema } from "./schemas/board.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardsService } from "./services/boards.service";
import { BoardsController } from "./boards.controller";
import { TasksService } from "../tasks/tasks.service";
import { TasksModule } from "../tasks/tasks.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema }
    ]),
    TasksModule
  ],
  providers: [
    BoardsService
  ],
  controllers: [
    BoardsController
  ],
  exports: [
    BoardsService
  ]
})
export class BoardsModule {}
