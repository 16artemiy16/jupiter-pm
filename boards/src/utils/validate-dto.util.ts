import { validate } from "class-validator";
import { plainToClass } from 'class-transformer'

export default async (dto, metaType): Promise<string[]> => {
  const obj = plainToClass(metaType, dto);
  const errors = await validate(obj);

  // Map and flatten the errors array
  return Array.prototype.concat.apply(
    [],
    errors.map((error) => Object.values(error.constraints))
  );
};