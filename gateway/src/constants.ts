export const USER_SERVICE = 'USER_SERVICE';
export const JWT_SERVICE = 'JWT_SERVICE';
export const BOARD_SERVICE = 'BOARD_SERVICE';

export enum UserMsg {
  GetAll = 'getAll',
  GetById = 'getById',
  Create = 'create',
  Update = 'update',
  Remove = 'remove',
  ValidateUser = 'validateUser'
}

export enum JwtMsg {
  Login = 'login',
  Verify = 'verify'
}

export enum BoardMsg {
  GetAll = 'board_getAll',
  GetById = 'board_getById',
  GetByUser = 'board_getByUser',
  Create = 'board_create',
  Update = 'board_update',
  Remove = 'board_remove',
}

export enum TaskMsg {
  GetByBoard = 'task_getByBoard',
  Create = 'task_create',
  ChangeColumn = 'task_changeColumn',
  Update = 'task_updateTask',
  Remove = 'task_removeTask',
}