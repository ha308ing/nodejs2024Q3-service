import { ForbiddenException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  users = new Map();
  passwords = new Map<string, string>();

  create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const id = randomUUID();

    this.passwords.set(id, password);

    const timestamp = new Date();

    const user = {
      id,
      login,
      version: 1,
      createdAt: +timestamp,
      updatedAt: +timestamp,
    };

    this.users.set(id, user);

    return user;
  }

  findAll() {
    return Array.from(this.users.values());
  }

  hasOne(id: string) {
    return this.users.has(id);
  }

  findOne(id: string) {
    return this.users.get(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.get(id);
    const password = this.passwords.get(id);

    if (user == undefined || password == undefined) return;

    const { login, newPassword, oldPassword } = updateUserDto;

    if (oldPassword != password) {
      throw new ForbiddenException();
    }

    const updatedAt = +new Date();

    const updatedUser = {
      ...user,
      login: login ?? user.login,
      version: ++user.version,
      updatedAt,
      id,
    };

    this.users.set(id, updatedUser);
    this.passwords.set(id, newPassword);

    return updatedUser;
  }

  remove(id: string) {
    this.users.delete(id);
    this.passwords.delete(id);
  }
}
