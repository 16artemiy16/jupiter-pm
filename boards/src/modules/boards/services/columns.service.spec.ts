import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from "./columns.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Column, ColumnDocument, ColumnSchema } from "../schemas/column.schema";
import { Model, Types } from "mongoose";
import { closeInMongodConnection, rootMongooseTestModule } from "../../../utils/unit-tests/mongo-memory.util";


describe('ColumnsService', () => {
  let service: ColumnsService;
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

    service = module.get<ColumnsService>(ColumnsService);
    columnModel = module.get<Model<ColumnDocument>>(Column.name + 'Model');
  });

  afterEach(async () => {
    await columnModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  beforeEach(async () => {
    await columnModel.insertMany([
      { _id: Types.ObjectId('6023ad01ba00490face3c8b1'), name: 'First', board: '6023ad01ba00490face3c8b2' },
      { _id: Types.ObjectId('6023ad01ba00490face3c8b2'), name: 'Second', board: '6023ad01ba00490face3c8b2' },
      { _id: Types.ObjectId('6023ad01ba00490face3c8b3'), name: 'Third', board: '6023ad01ba00490face3c8b2' }
    ])
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getByBoard()', async () => {
    const cols = await service.getByBoard('6023ad01ba00490face3c8b2');
    const expectedIds = ['6023ad01ba00490face3c8b1', '6023ad01ba00490face3c8b2', '6023ad01ba00490face3c8b3'];
    expect(
      cols.map(({ _id }) => _id.toString())
    ).toEqual(expectedIds);
  });
});