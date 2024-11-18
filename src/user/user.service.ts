import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../common/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return plainToInstance(UserEntity, await this.prisma.user.create({ data }));
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return plainToInstance(UserEntity, users);
  }

  async hasOne(id: string) {
    return (
      (await this.prisma.user.count({
        where: {
          id,
        },
      })) > 0
    );
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return plainToInstance(UserEntity, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (user == undefined) return;

    const { newPassword, oldPassword } = updateUserDto;

    if (oldPassword != user.password) {
      throw new ForbiddenException();
    }

    const updatedUser = await this.prisma.user.update({
      data: {
        password: newPassword,
        version: user.version + 1,
      },
      where: { id },
    });

    return plainToInstance(UserEntity, updatedUser);
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
