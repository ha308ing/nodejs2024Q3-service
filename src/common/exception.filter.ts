import {
  ExceptionFilter as EF,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

const EXCEPTION_MESSAGE = 'Internal server error';

@Catch()
export class ExceptionFilter implements EF {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const path = httpAdapter.getRequestUrl(ctx.getRequest());

    if (httpStatus >= 500) {
      Logger.error(
        `${httpStatus} ${path} ${exception.stack ?? ''}`,
        host.getType(),
      );
    } else {
      Logger.warn(`${httpStatus} ${path}`, host.getType());
    }

    const message = exception.message || EXCEPTION_MESSAGE;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path,
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
