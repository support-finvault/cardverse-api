import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RegisterPushTokenDto {
  @ApiProperty({ example: 'ExponentPushToken[xxxxxxx]' })
  @IsString()
  @IsNotEmpty()
  expoPushToken: string;

  @ApiProperty({ example: 'ios-device-uuid' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ example: 'ios', required: false })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiProperty({ example: '1.0.3', required: false })
  @IsOptional()
  @IsString()
  appVersion?: string;
}
