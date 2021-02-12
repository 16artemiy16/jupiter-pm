import { IsNotEmpty } from "class-validator";

export class UpdateColumnDto {
  @IsNotEmpty()
  name: string;
}