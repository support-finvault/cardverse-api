import {
  Catch,
  ArgumentsHost,
  ForbiddenException,
  HttpServer,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ERROR_MESSAGES_COMMON } from '../app.constants';
import { LoggerService } from '../logger/logger.service';
import { ValidationException } from '../common/validation.exception';

@Catch()
export default class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    applicationRef: HttpServer,
    private logger: LoggerService,
  ) {
    super(applicationRef);
  }

  catch(exception: any, host: ArgumentsHost) {
    console.log(
      '🚀 ~ file: exceptions-filter.ts ~ line 21 ~ AllExceptionsFilter ~ exception',
      exception,
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    this.logger.error(exception, request);
    if (exception instanceof ValidationException) {
      const status = exception.getStatus();
      response.status(status).json({
        success: false,
        validation_messages: exception.getResponse(),
        error_message: ERROR_MESSAGES_COMMON.BAD_REQUEST,
      });
    } else if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      const status = exception.getStatus();
      response.status(status).json({
        success: false,
        error_message: exception.message,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error_message: ERROR_MESSAGES_COMMON.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
