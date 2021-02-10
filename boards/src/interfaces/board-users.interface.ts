import { BoardUserRole } from "../enums/board-user-role.enum";

export interface BoardUserI {
  user: string;
  role: BoardUserRole
}