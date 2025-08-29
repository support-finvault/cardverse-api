import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { SupabaseAuthGuard } from 'src/auth/supabse-auth.guard';
import { KycService } from './kyc.service';
import { KycEntity } from './entities/kyc.entity';
import { ApiErrorResponses } from 'src/utils/api-error-responses';
import { BaseResponseDto } from 'src/common';

@ApiTags('KYC') // Grouping under 'KYC' in Swagger
@ApiBearerAuth() // Adds Authorization header for JWT authentication
@Controller('kyc')
@UseGuards(SupabaseAuthGuard) // Protects all routes with authentication
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Get KYC by User ID',
    description: 'Fetches KYC details for the authenticated user.',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'The unique ID of the user whose KYC details are needed.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: KycEntity,
    description: 'KYC details retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseResponseDto,
    description: 'KYC record not found for the user.',
  })
  @ApiErrorResponses()
  getKycByUser(@Param('userId') userId: number) {
    return this.kycService.getKycByUser(userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create KYC',
    description:
      'Submits KYC details for verification. Only the authenticated user can submit their own KYC.',
  })
  @ApiBody({ type: CreateKycDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: KycEntity,
    description: 'KYC submitted successfully.',
  })
  @ApiErrorResponses()
  createKyc(@Request() req, @Body() createKycDto: CreateKycDto) {
    console.log(req.user);

    const userId = req.user?.id; // Get user ID from authenticated request
    return this.kycService.createKyc(userId, createKycDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update KYC',
    description:
      'Updates the KYC details of the authenticated user. Users can only update their own KYC.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique ID of the KYC record to update.',
  })
  @ApiBody({ type: UpdateKycDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: KycEntity,
    description: 'KYC details updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseResponseDto,
    description: 'KYC record not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: BaseResponseDto,
    description: 'User is not authorized to update this KYC record.',
  })
  @ApiErrorResponses()
  updateKyc(
    @Request() req,
    @Param('id') id: string,
    @Body() updateKycDto: UpdateKycDto,
  ) {
    const userId = req.user?.id; // Get user ID from authenticated request
    return this.kycService.updateKyc(userId, id, updateKycDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate KYC',
    description:
      'Marks a KYC record as inactive. Users can only deactivate their own KYC records.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique ID of the KYC record to deactivate.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponseDto,
    description: 'KYC record deactivated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseResponseDto,
    description: 'KYC record not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: BaseResponseDto,
    description: 'User is not authorized to deactivate this KYC record.',
  })
  @ApiErrorResponses()
  deactivateKyc(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id; // Get user ID from authenticated request
    return this.kycService.deactivateKyc(userId, id);
  }
}
