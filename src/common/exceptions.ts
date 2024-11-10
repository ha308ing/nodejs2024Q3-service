import { HttpException, HttpStatus } from '@nestjs/common';

export class IdNotFoundException extends HttpException {
  constructor() {
    super('id not found', HttpStatus.NOT_FOUND);
  }
}
