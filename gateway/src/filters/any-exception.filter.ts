import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    delete error.response;

    return response
      .status(error.statusCode || 500)
      .json(error);
  }
}