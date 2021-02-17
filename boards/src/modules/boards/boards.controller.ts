import {
  Controller,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { BoardsService } from './services/boards.service';
import { BoardMsg, TaskMsg } from "./boards.constants";
import { CreateBoardDto } from "./dtos/create-board.dto";
import { UpdateBoardDto } from "./dtos/update-board.dto";
import validateDto from "../../utils/validate-dto.util";
import { ObjectIdMalformedException } from "../../exceptions/object-id-mailformed.exception";
import { DtoValidationException } from "../../exceptions/dto-validation.exception";
import { NotFoundException } from "../../exceptions/not-found.exception";
import { TasksService } from "../tasks/tasks.service";

@Controller()
export class BoardsController {
  constructor(
    private readonly boardService: BoardsService,
    private readonly taskService: TasksService
  ) {}

  @MessagePattern(BoardMsg.GetAll)
  async getAll() {
    return await this.boardService.getAll();
  }

  @MessagePattern(BoardMsg.GetById)
  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ObjectIdMalformedException();
    }

    const board = await this.boardService.getById(id);

    if (!board) {
      throw new NotFoundException();
    }

    return board;
  }

  @MessagePattern(BoardMsg.GetByUser)
  async getByUser(userId: string) {
    return await this.boardService.getByUser(userId);
  }

  @MessagePattern(BoardMsg.Create)
  async create({userId, dto}: {userId: string, dto: CreateBoardDto}) {
    const dtoErrors = await validateDto(dto, CreateBoardDto);

    if (dtoErrors.length) {
      throw new DtoValidationException(dtoErrors);
    }

    return await this.boardService.create(dto, userId)
  }

  @MessagePattern(BoardMsg.Update)
  async update({id, dto}: {id: string, dto: UpdateBoardDto}) {
    const dtoErrors = await validateDto(dto, UpdateBoardDto);

    if (dtoErrors.length) {
      throw new DtoValidationException(dtoErrors);
    }

    return await this.boardService.update(id, dto);
  }

  @MessagePattern(BoardMsg.Remove)
  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ObjectIdMalformedException();
    }

    const removedBoard = await this.boardService.remove(id);

    if (!removedBoard) {
      throw new NotFoundException();
    }

    return removedBoard;
  }


  /**
   ** Tasks
   */

  @MessagePattern(TaskMsg.GetByBoard)
  async getByBoard({ id, userId }: { id: string, userId: string }) {
    return await this.boardService.getTasksByBoard(id);
  }

  @MessagePattern(TaskMsg.Create)
  async createTask({ boardId, userId, dto }: { boardId: string, userId: string, dto: any }) {
    return await this.boardService.addTask(boardId, userId, dto);
  }

  @MessagePattern(TaskMsg.ChangeColumn)
  async changeTaskColumn({ id, userId, column }: { id: string, userId: string, column: string }) {
    return await this.taskService.changeColumn(id, column);
  }

  @MessagePattern(TaskMsg.Update)
  async updateTask({ id, userId, dto }: { id: string, userId: string, dto: any }) {
    return await this.taskService.update(id, dto);
  }

  @MessagePattern(TaskMsg.Remove)
  async removeTask({ id, userId } : { id: string, userId: string }) {
    return await this.taskService.remove(id);
  }
}
