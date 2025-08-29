import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';
import { City } from '../entities/city.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CountriesService } from '../services/countries.service';
import { SupabaseAuthGuard } from 'src/auth/supabse-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Countries')
@ApiBearerAuth()
@Controller('countries')
@UseGuards(SupabaseAuthGuard) // Protects all routes with authentication
@Public()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all countries',
    description: 'Returns a list of all available countries.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of countries',
    type: [Country],
  })
  async getAllCountries(): Promise<Country[]> {
    return this.countriesService.getCountries();
  }

  @Get(':countryId/states')
  @ApiOperation({
    summary: 'Get states by country',
    description: 'Returns a list of states for a given country ID.',
  })
  @ApiParam({
    name: 'countryId',
    type: 'integer',
    description: 'ID of the country',
  })
  @ApiResponse({ status: 200, description: 'List of states', type: [State] })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getStates(@Param('countryId') countryId: number): Promise<State[]> {
    return this.countriesService.getStatesByCountry(countryId);
  }
}
