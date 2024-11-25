import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId;
  },
);
