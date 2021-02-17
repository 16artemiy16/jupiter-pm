import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from "../schemas/board.schema";
import { Model, Types } from "mongoose";
import { BoardUserRole } from "../enums/board-user-role.enum";
import { CreateBoardDto } from "../dtos/create-board.dto";
import { UpdateBoardDto } from "../dtos/update-board.dto";

import flow from 'lodash/fp/flow';
import find from 'lodash/fp/find';
import get from 'lodash/fp/get';
import { TasksService } from "../../tasks/tasks.service";

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
    private readonly taskService: TasksService
  ) {}

  async getAll() {
    return await this.boardModel
      .find({})
      .lean()
      .exec();
  }

  async getById(id: string) {
    return await this.boardModel
      .findById(id)
      .lean()
      .exec();
  }

  async getSpawnColumn(id: string) {
    const boardColumns = await this.boardModel
      .findById(id, { _id: 0, columns: 1 })
      .lean()
      .exec();

    return flow(
      get('columns'),
      find('isSpawn')
    )(boardColumns);
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
    const INITIAL_COLUMNS = [
      { name: 'Backlog', isSpawn: true },
      { name: 'Todo' },
      { name: 'In progress' },
      { name: 'Review' },
      { name: 'Done' }
    ];

    const newBoard = new this.boardModel({
      ...dto,
      creator: userId,
      users: { user: userId, role: BoardUserRole.Admin },
      columns: INITIAL_COLUMNS
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

  async getTasksByBoard(id: string) {
    const board = await this.boardModel
      .findById(id)
      .select(['columns'])
      .lean()
      .exec();

    const { columns } = board;

    const requests = columns.map(async (column) => {
      const tasks = await this.taskService.getByCol(column._id);
      return { ...column, tasks }
    });

    return Promise.all(requests);
  }

  async addTask(boardId: string, userId: string, dto: any) {
    const column = await this.getSpawnColumn(boardId) as any;
    return await this.taskService.create(column._id, userId, dto);
  }

  async removeTask(id: string, userId: string) {
    return await this.taskService.remove(id)
  }
}
