import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BoardsModule } from './modules/boards/boards.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI_BOARDS, {
      useFindAndModify: false
    }),
    BoardsModule
  ]
})
export class TaskManagementModule {}
