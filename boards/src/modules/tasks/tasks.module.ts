import { Module } from '@nestjs/common';
import { TasksService } from "./tasks.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "./schemas/task.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema }
    ]),
  ],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule {}
