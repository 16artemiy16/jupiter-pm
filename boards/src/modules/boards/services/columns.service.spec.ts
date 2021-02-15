import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from "./columns.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Column, ColumnDocument, ColumnSchema } from "../schemas/column.schema";
import { Error, Model, Types } from "mongoose";
import { closeInMongodConnection, rootMongooseTestModule } from "../../../utils/unit-tests/mongo-memory.util";

import stringifyId from '../../../utils/stringify-id.util';

import _get from 'lodash/fp/get';
import _toString from 'lodash/fp/toString';
import _pick from 'lodash/fp/pick'
import _unary from 'lodash/fp/unary';
import _find from 'lodash/find';
import _reject from 'lodash/reject';

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

  const INITIAL_COLS = [
    { _id: Types.ObjectId('6023ad01ba00490face3c8b1'), name: 'First', board: '6023ad01ba00490face3c7b2' },
    { _id: Types.ObjectId('6023ad01ba00490face3c8b2'), name: 'Second', board: '6023ad01ba00490face3c7b2' },
    { _id: Types.ObjectId('6023ad01ba00490face3c8b3'), name: 'Third', board: '6023ad01ba00490face3c7b2' },
    { _id: Types.ObjectId('6023ad01ba00490face3c8b4'), name: 'Fourth', board: '6023ad01ba00490face3c7b1' }
  ];

  beforeEach(async () => {
    await columnModel.insertMany(INITIAL_COLS)
  });

  it('should be defined', () => {
    expect(columnService).toBeDefined();
  });

  /** getByBoard() **/

  it('getByBoard() should return columns related to the board', async () => {
    const cols = await columnService.getByBoard('6023ad01ba00490face3c7b2');

    expect(
      cols
        .map(_get('_id'))
        .map(_toString)
    ).toEqual(
      ['6023ad01ba00490face3c8b1', '6023ad01ba00490face3c8b2', '6023ad01ba00490face3c8b3']
    );
  });

  /** create() **/

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
            ...INITIAL_COLS,
            createdCol
          ])
      );
    });

    /** create() validation **/

    describe('should validate', () => {
      it('dto.name is incorrect => throws ValidationError (mongoose)', async () => {
        expect(
          columnService.create('6023ad01ba00490face3c7b2', { name: '' })
        )
          .rejects
          .toThrowError(Error.ValidationError);
      });

      // TODO: No such functionality in columns service yet
      xit('no board with the provided id: should throw ', () => {

      });
    });
  });

  /** update() **/

  describe('update()',  () => {
    it('should update a column and return its new version', async () => {
      const colId = '6023ad01ba00490face3c8b1';
      const dto = { name: 'First Changed' };

      const updatedCol = await columnService.update(colId, dto);

      expect(stringifyId(updatedCol))
        .toEqual(
          { _id: '6023ad01ba00490face3c8b1', name: 'First Changed', board: '6023ad01ba00490face3c7b2' }
        );

      const newColumnsList = await columnModel.find({}).lean().exec();

      expect(
        newColumnsList.map(_unary(stringifyId))
      ).toEqual([
        { _id: '6023ad01ba00490face3c8b1', name: 'First Changed', board: '6023ad01ba00490face3c7b2' },
        { _id: '6023ad01ba00490face3c8b2', name: 'Second', board: '6023ad01ba00490face3c7b2' },
        { _id: '6023ad01ba00490face3c8b3', name: 'Third', board: '6023ad01ba00490face3c7b2' },
        { _id: '6023ad01ba00490face3c8b4', name: 'Fourth', board: '6023ad01ba00490face3c7b1' }
      ])
    });

    /** update() validation **/

    describe('should validate', () => {
      it('no column with the given id => return null ', async () => {
        const notExistingId = '6023ad01ba00490face00000';
        const dto = { name: 'CHANGED NAME' };

        const updatedCol = await columnService.update(notExistingId, dto);

        expect(updatedCol).toBeNull();
      });

      it('dto.name is incorrect => throws ValidationError (mongoose)', async () => {
        expect(
          columnService.update('6023ad01ba00490face3c8b2', { name: '' })
        )
          .rejects
          .toThrowError(Error.ValidationError);
      })
    });
  });

  /** remove() **/
  describe('remove()', () => {
    it('should remove a column and return it', async () => {
      const idToRemove = '6023ad01ba00490face3c8b1';
      const removedCol = await columnService.remove(idToRemove);

      expect(
        stringifyId(removedCol)
      ).toEqual(
        _find(
          INITIAL_COLS.map(_unary(stringifyId)),
          ['_id', idToRemove]
        )
      );

      const newColumnsList = await columnModel.find({}).lean().exec();

      expect(
        newColumnsList
      ).toEqual(
        _reject(INITIAL_COLS, (col) => stringifyId(col)._id === idToRemove)
      );
    });

    it('no column with the given id => should remove nothing and return null', async () => {
      const notExistingId = '6023ad01ba00490face00000';
      const removedCol = await columnService.remove(notExistingId);
      const newColumnsList = await columnModel.find({}).lean().exec();

      expect(removedCol).toBeNull();
      expect(
        newColumnsList
      ).toEqual(INITIAL_COLS);
    });
  });

});