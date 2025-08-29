import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {}

  async getCountries(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async getStatesByCountry(countryId: number): Promise<State[]> {
    return this.stateRepository.find({ where: { country_id: countryId } });
  }
}
