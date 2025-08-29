import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CityService } from '../services/city.service';
import { City } from '../entities/city.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from 'src/auth/supabse-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Cities') // Groups endpoints under "Cities" in Swagger UI
@Controller('cities')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Public()
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiOperation({ summary: 'Get all cities' }) // Describes the endpoint in Swagger
  @ApiResponse({ status: 200, description: 'Returns an array of all cities' })
  @Get()
  findAll(): Promise<City[]> {
    return this.cityService.findAll();
  }

  @ApiOperation({ summary: 'Get a single city by ID' })
  @ApiResponse({ status: 200, description: 'Returns a single city' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'City ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<City> {
    return this.cityService.findOne(id);
  }

  @ApiOperation({ summary: 'Get cities by state ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns cities belonging to a state',
  })
  @ApiResponse({ status: 404, description: 'State not found or no cities' })
  @ApiParam({ name: 'stateId', type: 'number', description: 'State ID' })
  @Get('state/:stateId')
  async getCities(@Param('stateId') stateId: number): Promise<City[]> {
    return this.cityService.getCitiesByStateId(stateId);
  }
}
