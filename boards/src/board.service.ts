import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from "./schemas/board.schema";
import { Model } from "mongoose";

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>
  ) {}

  async getAll() {
    return await this.boardModel.find({}).lean().exec();
  }

  async getById(id: string) {
    return await this.boardModel.findById(id);
  }

  // TODO: add filter by role
  async getByUser(userId: string) {
    return await this.boardModel.find({
      $or: [ { 'users.id': userId }, { creator: userId } ]
    })
  }

  async create(dto: any) {
    const newBoard = new this.boardModel(dto);
    return await newBoard.save();
  }

  async update(id: string, dto: any) {
    return await this.boardModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return await this.boardModel.findByIdAndDelete(id);
  }
}
