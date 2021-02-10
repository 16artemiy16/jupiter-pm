import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BoardService } from './board.service';
import { BoardMsg } from "./constants";

@Controller()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @MessagePattern(BoardMsg.GetAll)
  getAll() {
    return 'getAll';
  }

  @MessagePattern(BoardMsg.GetById)
  getById(id: string) {
    return id;
  }

  @MessagePattern(BoardMsg.GetByUser)
  getByUser(userId: string) {
    return userId;
  }

  @MessagePattern(BoardMsg.Create)
  create(dto: any) {
    return dto;
  }

  @MessagePattern(BoardMsg.Update)
  update({id, dto}: {id: string, dto: any}) {
    return dto;
  }

  @MessagePattern(BoardMsg.Remove)
  remove(id: string) {
    return id;
  }
}
