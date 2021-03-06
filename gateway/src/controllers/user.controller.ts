import { Body, Controller, Delete, Get, Inject, OnApplicationBootstrap, Param, Post, Put } from '@nestjs/common';
import { USER_SERVICE, UserMsg } from "../constants";
import { ClientProxy } from "@nestjs/microservices";

@Controller('user')
export class UserController implements OnApplicationBootstrap {
  constructor(
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy
  ) {}

  async onApplicationBootstrap() {
    await this.userServiceClient.connect();
  }

  @Get()
  getAll() {
    return this.userServiceClient.send(UserMsg.GetAll, {})
  };

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userServiceClient.send(UserMsg.GetById, id)
  }

  @Post()
  create(@Body() dto: any) {
    return this.userServiceClient.send(UserMsg.Create, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.userServiceClient.send(UserMsg.Update, { id, dto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userServiceClient.send(UserMsg.Remove, id)
  }
}
