import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    Logger.log(
      `[REQUEST] ${request.method} ${request.url} query: ${JSON.stringify(request.query)} body: ${JSON.stringify(request.body)}`,
      context.getType(),
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        Logger.log(
          `[RESPONSE] ${response.statusCode} Response time: ${Date.now() - now}ms`,
          context.getType(),
        );
      }),
    );
  }
}
