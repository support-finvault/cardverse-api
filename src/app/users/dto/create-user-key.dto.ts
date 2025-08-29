import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserKeyDto {
  @IsNotEmpty()
  @IsString()
  publicKeyPem: string;

  @IsString()
  deviceId?: string;
}
