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
import { BOARD_SERVICE, BoardMsg } from "../constants";
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

  @Get(':id/column')
  getColumns(@Param('id') id: string) {
    return this.boardServiceClient.send(BoardMsg.GetColumns, id)
  }

  @Post(':id/column')
  createColumn(@Param('id') boardId: string, @Body() dto: any) {
    return this.boardServiceClient.send(BoardMsg.AddColumn, { boardId, dto })
  }
}
