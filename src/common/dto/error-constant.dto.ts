import { ApiProperty } from '@nestjs/swagger';

export class ErrorConstantDto {
  @ApiProperty()
  readonly code: string;
  @ApiProperty()
  readonly description: string;
}
