import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { UserEntity } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(data: LoginDto) {
    const { user } = await this.userService.findOneByLogin(data.login);

    if (user != null) throw new UnauthorizedException();

    const rounds = parseInt(process.env?.CRYPT_SALT);
    const salt = await bcrypt.genSalt(rounds);

    const passwordHash = await bcrypt.hash(data.password, salt);
    data.password = passwordHash;

    const newUser = await this.userService.create(data);

    return this.addUserTokens(newUser);
  }

  async login(data: LoginDto) {
    const { user, password: hash } = await this.userService.findOneByLogin(
      data.login,
    );

    const isMatch = await bcrypt.compare(data.password, hash);

    if (!isMatch) throw new UnauthorizedException();

    return this.addUserTokens(user);
  }

  async refresh(data: RefreshDto) {
    const id = await this.getIdRefreshToken(data.refreshToken);

    const user = await this.userService.findOne(id);

    if (user == null) throw new UnauthorizedException();

    return this.addUserTokens(user);
  }

  private async addUserTokens(user: UserEntity) {
    const payload = { userId: user.id, login: user.login };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env?.TOKEN_EXPIRE_TIME,
      secret: process.env?.JWT_SECRET_KEY,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env?.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env?.JWT_SECRET_REFRESH_KEY,
    });

    return {
      accessToken,
      refreshToken,
      ...user,
    };
  }

  private async getIdRefreshToken(refreshToken: string): Promise<string> {
    try {
      const sub = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env?.JWT_SECRET_REFRESH_KEY,
      });

      const id = sub?.userId;

      if (id == undefined) throw new ForbiddenException();

      return id;
    } catch {
      throw new ForbiddenException();
    }
  }
}
