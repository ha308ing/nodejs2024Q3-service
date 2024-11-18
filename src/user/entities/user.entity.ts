import { Exclude, Transform } from 'class-transformer';
import { IUser } from '../interfaces/user.interface';

export class UserEntity implements IUser {
  id: string;
  login: string;
  version: number;

  @Transform(({ value }) => +new Date(value))
  updatedAt: number;

  @Transform(({ value }) => +new Date(value))
  createdAt: number;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
