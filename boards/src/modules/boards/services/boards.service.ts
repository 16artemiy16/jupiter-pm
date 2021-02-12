import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from "../schemas/board.schema";
import { Model } from "mongoose";
import { BoardUserRole } from "../enums/board-user-role.enum";
import { CreateBoardDto } from "../dtos/create-board.dto";
import { UpdateBoardDto } from "../dtos/update-board.dto";
import { ColumnsService } from "./columns.service";

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
    private readonly columnsService: ColumnsService
  ) {}

  async getAll() {
    return await this.boardModel
      .find({})
      .lean()
      .exec();
  }

  async getById(id: string) {
    const board = await this.boardModel
      .findById(id)
      .lean()
      .exec();

    const columns = await this.columnsService.getByBoard(board._id);
    
    return {
      ...board,
      columns
    };
  }

  // TODO: add filter by role
  async getByUser(userId: string) {
    return await this.boardModel
      .find({
        $or: [ { 'users.id': userId }, { creator: userId } ]
      })
      .lean()
      .exec()
  }

  async create(dto: CreateBoardDto, userId: string) {
    const newBoard = new this.boardModel({
      ...dto,
      creator: userId,
      users: { user: userId, role: BoardUserRole.Admin }
    });
    return await newBoard.save();
  }

  async update(id: string, dto: UpdateBoardDto) {
    return await this.boardModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();
  }

  async remove(id: string) {
    return await this.boardModel
      .findByIdAndDelete(id)
      .lean()
      .exec();
  }
}
