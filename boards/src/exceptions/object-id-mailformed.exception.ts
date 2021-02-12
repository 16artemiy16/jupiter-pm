import { MicroserviceException } from "./microservice.exception";

export class ObjectIdMalformedException extends MicroserviceException {
  constructor() {
    super(400, 'The id does not match the ObjectId format');
  }
}