import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SupabaseAuthGuard } from 'src/auth/supabse-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiErrorResponses } from 'src/utils/api-error-responses';
import { BaseResponseDto } from 'src/common';
import { CreateUserKeyDto } from './dto/create-user-key.dto';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';

@ApiTags('Users') // Groups all endpoints under 'Users' in Swagger UI
@ApiBearerAuth() // Adds Authorization header for JWT auth in Swagger
@Controller('users')
@UseGuards(SupabaseAuthGuard) // Protects all routes with authentication
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('sync')
  @ApiOperation({
    summary: 'Sync user data',
    description:
      'Validates the Supabase token and returns the synced user data.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
    description: 'User synced successfully.',
  })
  @ApiErrorResponses()
  sync(@Request() req) {
    return req.user;
  }

  @Get()
  @ApiOperation({
    summary: 'Get logged in user',
    description: 'Retrieves the logged in user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
    description: 'Retrieves the logged in user',
  })
  @ApiErrorResponses()
  findUser(@Request() req) {
    return req.user;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Retrieves details of a user by their unique ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique ID of the user to retrieve.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
    description: 'User details retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseResponseDto,
    description: 'User not found.',
  })
  @ApiErrorResponses()
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update the authenticated user',
    description: 'Updates the details of the currently authenticated user.',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
    description: 'User updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseResponseDto,
    description: 'User not found.',
  })
  @ApiErrorResponses()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user?.id; // Extract authenticated user ID from token
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Marks a user as inactive instead of actual deletion.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique ID of the user to delete.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponseDto,
    description: 'User marked as inactive successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseResponseDto,
    description: 'User not found.',
  })
  @ApiErrorResponses()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('keys')
  @ApiOperation({
    summary: 'Register user public key',
    description: 'Stores or updates the public key for the logged-in user.',
  })
  @ApiBody({ type: CreateUserKeyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User public key registered successfully.',
  })
  @ApiErrorResponses()
  registerPublicKey(@Request() req, @Body() dto: CreateUserKeyDto) {
    return this.usersService.registerUserPublicKey(req.user.id, dto);
  }

  @Post('push-token')
  @ApiOperation({
    summary: 'Register or update Expo push token',
    description:
      'Registers or updates the Expo push token for the current device.',
  })
  @ApiBody({ type: RegisterPushTokenDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Push token registered or updated successfully.',
  })
  @ApiErrorResponses()
  registerPushToken(@Request() req, @Body() dto: RegisterPushTokenDto) {
    return this.usersService.registerPushToken(req.user.id, dto);
  }
}
