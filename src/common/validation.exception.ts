import {
    HttpException,
    HttpStatus,
  } from '@nestjs/common';

export class ValidationException extends HttpException {
    constructor(validation_messages: string[]) {
      super(validation_messages, HttpStatus.BAD_REQUEST);
    }
}
  