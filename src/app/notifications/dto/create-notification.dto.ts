import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'You have a new message!' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'New Alert' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Account Update' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({
    example: {
      screen: 'Messages',
      messageId: 'abc123',
    },
  })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiPropertyOptional({ example: 'default' })
  @IsOptional()
  @IsString()
  sound?: string;

  @ApiPropertyOptional({ enum: ['default', 'normal', 'high'], example: 'high' })
  @IsOptional()
  @IsEnum(['default', 'normal', 'high'])
  priority?: 'default' | 'normal' | 'high';

  @ApiPropertyOptional({ example: 3600 })
  @IsOptional()
  @IsNumber()
  ttl?: number;

  @ApiPropertyOptional({ example: 'default' })
  @IsOptional()
  @IsString()
  channelId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  badge?: number;
}
