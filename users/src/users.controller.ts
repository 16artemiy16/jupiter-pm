import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from "@nestjs/microservices";
import { UserMsg } from "./constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserI } from "./interfaces/user.interface";
import { UserDocument } from "./schemas/user.schema";

@Controller()
export class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @MessagePattern(UserMsg.GetAll)
  getAll(): Promise<UserI[]> {
     return this.userService.getAll();
  }

  @MessagePattern(UserMsg.GetById)
  getById(id: string): Promise<UserI> {
    return this.userService.getById(id);
  }

  @MessagePattern(UserMsg.Create)
  create(dto: CreateUserDto): Promise<UserDocument> {
    return this.userService.create(dto);
  }

  @MessagePattern(UserMsg.Update)
  update({ id, dto }: { id: string, dto: UpdateUserDto }): Promise<UserI> {
    return this.userService.update(id, dto);
  }

  @MessagePattern(UserMsg.Remove)
  remove(id: string): Promise<UserI> {
    return this.userService.remove(id);
  }

  @MessagePattern(UserMsg.ValidateUser)
  validateUser({ email, password }: { email: string, password: string }): Promise<UserI | null> {
    return this.userService.validateUser(email, password);
  }
}
