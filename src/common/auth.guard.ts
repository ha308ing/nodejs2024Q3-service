import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

const tokenForbiddenErrors = ['jwt malformed', 'jwt expired'];

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const refreshToken = request.body?.refreshToken;

    if (isPublic && refreshToken == undefined) return true;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken ?? token, {
        secret: refreshToken
          ? process.env?.JWT_SECRET_REFRESH_KEY
          : process.env?.JWT_SECRET_KEY,
      });

      request['userId'] = payload?.userId;
    } catch (error) {
      if (tokenForbiddenErrors.includes(error.message))
        throw new ForbiddenException();
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
