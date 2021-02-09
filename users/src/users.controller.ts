import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from "@nestjs/microservices";
import { UserMsg } from "./constants";

@Controller()
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern(UserMsg.GetAll)
  getAll() {
     return 'getAll';
  }

  @MessagePattern(UserMsg.GetById)
  getById(id: any) {
    return id;
  }

  @MessagePattern(UserMsg.Create)
  create(dto: any) {
    return dto;
  }

  @MessagePattern(UserMsg.Update)
  update(id: string, dto: any) {
    return { ...dto, id };
  }

  @MessagePattern(UserMsg.Remove)
  remove(id: any) {
    return id;
  }
}
