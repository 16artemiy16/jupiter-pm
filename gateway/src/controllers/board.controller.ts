import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnApplicationBootstrap,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { BOARD_SERVICE, BoardMsg, TaskMsg } from "../constants";
import { ClientProxy } from "@nestjs/microservices";
import { JwtGuard } from "../jwt.guard";
import { User } from "../decorators/user.decorator";

@UseGuards(JwtGuard)
@Controller('board')
export class BoardController implements OnApplicationBootstrap {
  constructor(
    @Inject(BOARD_SERVICE) private readonly boardServiceClient: ClientProxy
  ) {}

  async onApplicationBootstrap() {
    await this.boardServiceClient.connect();
  }


  /**
   ** Boards
   */

  @Get()
  getAll() {
    return this.boardServiceClient.send(BoardMsg.GetAll, '');
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.boardServiceClient.send(BoardMsg.GetById, id);
  }

  @Get('/user/:userId')
  getByUser(@Param('userId') userId: string) {
    return this.boardServiceClient.send(BoardMsg.GetByUser, userId);
  }

  @Post()
  create(@Body() dto: any, @User('_id') userId: string) {
    return this.boardServiceClient.send(BoardMsg.Create, { dto, userId });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.boardServiceClient.send(BoardMsg.Update, { id, dto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardServiceClient.send(BoardMsg.Remove, id);
  }


  /**
   ** Columns
   */

  // TODO implement columns in future

  /**
   ** Tasks
   */

  @Get(':id/task')
  getTasks(@Param('id') id: string, @Param('_id') userId: string) {
    return this.boardServiceClient.send(TaskMsg.GetByBoard, { id, userId });
  }

  @Post(':id/task')
  createTask(@Param('id') boardId, @User('_id') userId: string, @Body() dto: any) {
    return this.boardServiceClient.send(TaskMsg.Create, { boardId, userId, dto });
  }

  @Put('/task/:id/column/:column')
  changeTaskColumn(@Param('id') id: string, @Param('column') column: string, @User('_id') userId: string) {
    return this.boardServiceClient.send(TaskMsg.ChangeColumn, { id, userId, column })
  }

  @Put('/task/:id')
  updateTask(@Param('id') id, @User('_id') userId: string, @Body() dto: any) {
    return this.boardServiceClient.send(TaskMsg.Update, { id, userId, dto });
  }

  @Delete('/task/:id')
  removeTask(@Param('id') id: string, @User('_id') userId: string) {
    return this.boardServiceClient.send(TaskMsg.Remove, { id, userId });
  }
}
