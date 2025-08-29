import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common';

export function ApiErrorResponses() {
  return applyDecorators(
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponseDto }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, type: BaseResponseDto }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type: BaseResponseDto,
    }),
  );
}
