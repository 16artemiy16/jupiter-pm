import {
  Controller,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BoardService } from './board.service';
import { BoardMsg } from "./constants";
import { CreateBoardDto } from "./dtos/create-board.dto";
import { UpdateBoardDto } from "./dtos/update-board.dto";
import { validateDtoThrowable } from "./utils/validate-dto.util";

@Controller()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @MessagePattern(BoardMsg.GetAll)
  getAll() {
    return this.boardService.getAll();
  }

  @MessagePattern(BoardMsg.GetById)
  getById(id: string) {
    return this.boardService.getById(id);
  }

  @MessagePattern(BoardMsg.GetByUser)
  getByUser(userId: string) {
    return this.boardService.getByUser(userId);
  }

  @MessagePattern(BoardMsg.Create)
  async create({userId, dto}: {userId: string, dto: CreateBoardDto}) {
    await validateDtoThrowable(dto, CreateBoardDto);
    return this.boardService.create(dto, userId);
  }

  @MessagePattern(BoardMsg.Update)
  async update({id, dto}: {id: string, dto: UpdateBoardDto}) {
    await validateDtoThrowable(dto, UpdateBoardDto);
    return this.boardService.update(id, dto);
  }

  @MessagePattern(BoardMsg.Remove)
  remove(id: string) {
    return this.boardService.remove(id);
  }
}
