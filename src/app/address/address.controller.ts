import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { SupabaseAuthGuard } from 'src/auth/supabse-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AddressResponseDto,
  CreateAddressDto,
  UpdateAddressDto,
} from './dto/address.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({
    status: 201,
    description: 'Address created',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User or Property not found' })
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Request() req,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.create(
      createAddressDto,
      req.user.id,
    );
    return plainToClass(AddressResponseDto, address);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of addresses',
    type: [AddressResponseDto],
  })
  async findAll(@Request() req): Promise<AddressResponseDto[]> {
    const addresses = await this.addressService.findAllByUser(req.user.id);
    return plainToClass(AddressResponseDto, addresses);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific address' })
  @ApiResponse({
    status: 200,
    description: 'Address details',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.findOne(id, req.user.id);
    return plainToClass(AddressResponseDto, address);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({
    status: 200,
    description: 'Updated address',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Request() req,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.update(
      id,
      updateAddressDto,
      req.user.id,
    );
    return plainToClass(AddressResponseDto, address);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address deleted' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.addressService.remove(id, req.user.id);
  }
}
