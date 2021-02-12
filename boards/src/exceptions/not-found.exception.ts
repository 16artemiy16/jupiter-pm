import { MicroserviceException } from "./microservice.exception";

export class NotFoundException extends MicroserviceException {
  constructor(msg: string = 'Not found') {
    super(404, msg)
  }
}