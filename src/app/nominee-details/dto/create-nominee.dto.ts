import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNomineeDto {
  @ApiProperty({
    description: 'Full name of the nominee',
    example: 'Rahul Sharma',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nomineeName: string;

  @ApiProperty({
    description: 'Relationship with the user',
    example: 'Father',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiProperty({
    description: 'Phone number of the nominee (10-15 digits)',
    example: '9876543210',
    required: true,
  })
  @IsString()
  @Length(10, 15)
  phone: string;

  @ApiProperty({
    description: 'Email address of the nominee',
    example: 'rahul.sharma@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'PAN card number of the nominee (10 characters, format: AAAAA9999A)',
    example: 'ABCDE1234F',
    required: true,
  })
  @IsString()
  @Length(10, 10)
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN format' })
  pan: string;

  @ApiProperty({
    description: 'Aadhaar number of the nominee (12 digits)',
    example: '123456789012',
    required: true,
  })
  @IsString()
  @Length(12, 12)
  aadhaar: string;
}
