import { ApiProperty } from '@nestjs/swagger';

export class ConstantDto {
  @ApiProperty()
  readonly id: number;
  @ApiProperty()
  readonly code: string;
  @ApiProperty()
  readonly name: string;
}
