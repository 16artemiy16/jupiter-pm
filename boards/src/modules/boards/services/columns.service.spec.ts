import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from "./columns.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Column, ColumnDocument, ColumnSchema } from "../schemas/column.schema";
import { Error, Model, Types } from "mongoose";
import { closeInMongodConnection, rootMongooseTestModule } from "../../../utils/unit-tests/mongo-memory.util";

import _get from 'lodash/fp/get';
import _toString from 'lodash/fp/toString';
import _pick from 'lodash/fp/pick'


describe('ColumnsService', () => {
  let columnService: ColumnsService;
  let columnModel: Model<ColumnDocument>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Column.name, schema: ColumnSchema }
        ])
      ],
      providers: [
        ColumnsService
      ]
    })
      .compile();

    columnService = module.get<ColumnsService>(ColumnsService);
    columnModel = module.get<Model<ColumnDocument>>(Column.name + 'Model');
  });

  afterEach(async () => {
    await columnModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  const INITIAL_BOARDS = [
    { _id: Types.ObjectId('6023ad01ba00490face3c8b1'), name: 'First', board: '6023ad01ba00490face3c8b2' },
    { _id: Types.ObjectId('6023ad01ba00490face3c8b2'), name: 'Second', board: '6023ad01ba00490face3c8b2' },
    { _id: Types.ObjectId('6023ad01ba00490face3c8b3'), name: 'Third', board: '6023ad01ba00490face3c8b2' },
    { _id: Types.ObjectId('6023ad01ba00490face3c8b4'), name: 'Fourth', board: '6023ad01ba00490face3c8b1' }
  ];

  beforeEach(async () => {
    await columnModel.insertMany(INITIAL_BOARDS)
  });

  it('should be defined', () => {
    expect(columnService).toBeDefined();
  });

  it('getByBoard() should return columns related to the board', async () => {
    const cols = await columnService.getByBoard('6023ad01ba00490face3c8b2');

    expect(
      cols
        .map(_get('_id'))
        .map(_toString)
    ).toEqual(
      ['6023ad01ba00490face3c8b1', '6023ad01ba00490face3c8b2', '6023ad01ba00490face3c8b3']
    );
  });

  describe('create()', () => {
    it('should create a column and return it', async () => {
      const boardId = '6023ad01ba00490face3c8a0';
      const dto = { name: 'New name' };

      const createdCol = await columnService.create(boardId, dto);

      expect(
        _pick(['name', 'board'])(createdCol),
      ).toEqual({ name: 'New name', board: boardId });

      const newColumnsList = await columnModel.find({}).lean().exec();

      expect(
        _pick(['_id', 'name', 'board'])(newColumnsList)
      ).toEqual(
        _pick(
          ['_id', 'name', 'board'])
          ([
            ...INITIAL_BOARDS,
            createdCol
          ])
      );
    });

    describe('should not create column if creation data is invalid', () => {
      it('if dto.name is incorrect: should throw ValidationError (mongoose)', async () => {
        expect(
          columnService.create('6023ad01ba00490face3c8b2', { name: '' })
        )
          .rejects
          .toThrowError(Error.ValidationError);
      });

      // TODO: No such functionality in columns service yet
      xit('no board with the provided id: should throw ', () => {

      });
    });

    describe('update()', async () => {
      it('should update a column and return its new version', () => {

      });
    });

  })
});