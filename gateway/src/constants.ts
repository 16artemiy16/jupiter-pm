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
  GetAll = 'getAll',
  GetById = 'getById',
  GetByUser = 'getByUser',
  Create = 'create',
  Update = 'update',
  Remove = 'remove'
}