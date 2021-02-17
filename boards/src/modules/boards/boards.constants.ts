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