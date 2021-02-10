import { validate } from "class-validator";
import { plainToClass } from 'class-transformer'
import { RpcException } from "@nestjs/microservices";

export const validateDto = async (dto, metaType) => {
  const obj = plainToClass(metaType, dto);
  const errors = await validate(obj);

  // Map and flatten the errors array
  return Array.prototype.concat.apply(
    [],
    errors.map((error) => Object.values(error.constraints))
  );
};

/**
 * Validates dto and throws an RpcException exception if validation fails
 * @param dto
 * @param metaType
 * @returns {Promise<void>}
 */
export const validateDtoThrowable = async (dto, metaType): Promise<void> => {
  const errors = await validateDto(dto, metaType);

  if (errors.length) {
    throw new RpcException({
      errors,
      statusCode: 400,
      message: 'The validation failed'
    });
  }
};