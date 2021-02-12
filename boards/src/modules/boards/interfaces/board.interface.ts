import { BoardUserI } from "./board-users.interface";

export interface BoardI {
  _id: string;
  title: string;
  creator: string;
  users: BoardUserI[]
}