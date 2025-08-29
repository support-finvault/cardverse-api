import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class GetByNumberId {
  @ApiProperty({ required: true })
  @IsNumberString()
  @IsDefined()
  @IsNotEmpty()
  id: number;
}

export class GetByStringId {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  id: string;
}
