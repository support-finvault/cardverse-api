import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Length,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: '123 Main St', description: 'First line of address' })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'Second line of address',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsNotEmpty()
  @IsString()
  countryId: number;

  @IsNotEmpty()
  @IsString()
  stateId: number;

  @IsNotEmpty()
  @IsString()
  cityId: number;

  @ApiProperty({ example: '90001', description: 'Postal/ZIP code' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  pincode: string;

  @ApiProperty({
    example: 34.052235,
    description: 'Latitude coordinate',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    example: -118.243683,
    description: 'Longitude coordinate',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    description: 'Property ID this address belongs to',
    required: false,
  })
  @IsOptional()
  propertyId?: string;
}

export class UpdateAddressDto extends CreateAddressDto {}

export class AddressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty({ required: false })
  addressLine2?: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  pincode: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
