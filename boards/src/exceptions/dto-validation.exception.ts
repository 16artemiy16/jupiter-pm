import { MicroserviceException } from "./microservice.exception";

export class DtoValidationException extends MicroserviceException {
  constructor(mismatches) {
    super(400, 'Validation failed', { mismatches })
  }
}