import { ApiProperty } from '@nestjs/swagger';

export class CreatedByDto {
  @ApiProperty()
  readonly id: number;
  @ApiProperty()
  readonly first_name: string;
  @ApiProperty()
  readonly last_name: string;
}
