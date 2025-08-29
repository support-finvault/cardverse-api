import { ApiProperty } from '@nestjs/swagger';
import { ErrorConstantDto } from './error-constant.dto';

export class BaseResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  validation_messages?: string[] = [];

  @ApiProperty()
  error_message?: ErrorConstantDto;
}
