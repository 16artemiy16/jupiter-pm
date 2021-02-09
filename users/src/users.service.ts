import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from "./schemas/user.schema";
import { UserI } from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async getAll(): Promise<UserI[]> {
    return await this.userModel.find({}).lean().exec() as UserI[];
  }

  async getById(id: string): Promise<UserI> {
    return await this.userModel.findById(id).lean().exec() as UserI;
  }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    return await new this.userModel({
        ...dto,
        password: await bcrypt.hash(dto.password, 10)
      })
      .save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserI> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      dto,
      {
        new: true,
        lean: true
      }
    ).exec() as UserI;
  }

  async remove(id: string): Promise<UserI> {
    return await this.userModel.findByIdAndDelete(id) as UserI;
  }

  async validateUser(email: string, password: string): Promise<UserI | null> {
    const user = await this.userModel.findOne({ email }).lean().exec() as UserI;
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
