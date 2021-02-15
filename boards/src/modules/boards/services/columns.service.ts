import { Injectable } from '@nestjs/common';
import { Column, ColumnDocument } from "../schemas/column.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateColumnDto } from "../dtos/update-column.dto";
import { CreateColumnDto } from "../dtos/create-column.dto";

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name) private readonly columnModel: Model<ColumnDocument>
  ) {}

  async getByBoard(boardId: string) {
    return await this.columnModel
      .find({ board: boardId })
      .lean()
      .exec();
  }

  async create(boardId: string, dto: CreateColumnDto) {
    const newColumn = new this.columnModel({ ...dto, board: boardId });
    return await newColumn.save();
  }

  async update(id: string, dto: UpdateColumnDto) {
    return await this.columnModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .lean()
      .exec();
  };

  async remove(id: string) {
    return await this.columnModel
      .findByIdAndDelete(id)
      .lean()
      .exec();
  }
}
