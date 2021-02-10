import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board, BoardSchema } from "./schemas/board.schema";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI_BOARDS, {
      useFindAndModify: false
    }),
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema }
    ])
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
