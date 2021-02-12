import { RpcException } from "@nestjs/microservices";

export class MicroserviceException extends RpcException {
  constructor(statusCode: number, message: string, restInfo?: Record<string, any>) {
    super({
      statusCode,
      message,
      ...restInfo
    });
  }
}