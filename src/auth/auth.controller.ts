import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body(ValidationPipe) input: LoginDto) {
    return this.authService.signup(input);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(
    @Body(
      new ValidationPipe({
        exceptionFactory: () => new UnauthorizedException(),
      }),
    )
    input: RefreshDto,
  ) {
    return this.authService.refresh(input);
  }
}
