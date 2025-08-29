import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NomineeService } from './nominee.service';
import { SupabaseAuthGuard } from 'src/auth/supabse-auth.guard';
import { CreateNomineeDto } from './dto/create-nominee.dto';
import { UpdateNomineeDto } from './dto/update-nominee.dto';
import { NomineeDetails } from './entities/nominee-details.entity';

@ApiTags('Nominees')
@ApiBearerAuth()
@Controller('nominees')
@UseGuards(SupabaseAuthGuard)
export class NomineeController {
  constructor(private readonly nomineeService: NomineeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new nominee' })
  @ApiCreatedResponse({
    description: 'Nominee created successfully',
    type: NomineeDetails,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: CreateNomineeDto })
  create(@Req() req, @Body() createNomineeDto: CreateNomineeDto) {
    const user = req.user;
    return this.nomineeService.create(user.id, createNomineeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all nominees for current user' })
  @ApiOkResponse({
    description: 'List of nominees retrieved successfully',
    type: [NomineeDetails],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@Req() req) {
    const user = req.user;
    return this.nomineeService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific nominee by ID' })
  @ApiParam({ name: 'id', description: 'Nominee ID' })
  @ApiOkResponse({
    description: 'Nominee retrieved successfully',
    type: NomineeDetails,
  })
  @ApiNotFoundResponse({ description: 'Nominee not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Req() req, @Param('id') id: number) {
    const user = req.user;
    return this.nomineeService.findOne(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a nominee' })
  @ApiParam({ name: 'id', description: 'Nominee ID' })
  @ApiOkResponse({
    description: 'Nominee updated successfully',
    type: NomineeDetails,
  })
  @ApiNotFoundResponse({ description: 'Nominee not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: UpdateNomineeDto })
  update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateNomineeDto: UpdateNomineeDto,
  ) {
    const user = req.user;
    return this.nomineeService.update(user.id, id, updateNomineeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a nominee' })
  @ApiParam({ name: 'id', description: 'Nominee ID' })
  @ApiOkResponse({ description: 'Nominee deleted successfully' })
  @ApiNotFoundResponse({ description: 'Nominee not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  remove(@Req() req, @Param('id') id: number) {
    const user = req.user;
    return this.nomineeService.remove(user.id, id);
  }
}
