import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>
  ) {}

  async getByCol(column) {
    return await this.taskModel.find({ column })
      .lean()
      .exec();
  }

  async create(column: string, userId: string, dto: any) {
    return await this.taskModel.create({ ...dto, creator: userId, column })
  }

  async update(id: string, dto: any) {
    return await this.taskModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();
  }

  async changeColumn(id: string, column: string) {
    return await this.taskModel
      .findByIdAndUpdate(id, { column })
      .lean()
      .exec();
  }

  async remove(id: string) {
    return await this.taskModel
      .findByIdAndRemove(id)
      .lean()
      .exec();
  }
}
