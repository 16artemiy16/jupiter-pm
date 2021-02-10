import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BoardService } from './board.service';
import { BoardMsg } from "./constants";

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
  create(dto: any) {
    return this.boardService.create(dto);
  }

  @MessagePattern(BoardMsg.Update)
  update({id, dto}: {id: string, dto: any}) {
    return this.boardService.update(id, dto);
  }

  @MessagePattern(BoardMsg.Remove)
  remove(id: string) {
    return this.boardService.remove(id);
  }
}
