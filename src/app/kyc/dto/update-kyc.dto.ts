import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { KYCStatus } from '../entities/kyc.entity';

export class UpdateKycDto {
  @ApiPropertyOptional({
    description: 'PAN card number (10 characters)',
    example: 'ABCDE1234F',
    minLength: 10,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  pan?: string;

  @ApiPropertyOptional({
    description: 'Aadhaar number (12-digit unique identification number)',
    example: '123456789012',
    minLength: 12,
    maxLength: 12,
  })
  @IsOptional()
  @IsString()
  @Length(12, 12)
  aadhaar?: string;

  @ApiPropertyOptional({
    description: 'KYC verification status',
    example: KYCStatus.PENDING,
    enum: KYCStatus,
  })
  @IsOptional()
  @IsEnum(KYCStatus)
  verified?: KYCStatus;
}
