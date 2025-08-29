// Services
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  findAll() {
    return this.cityRepository.find();
  }

  findOne(id: number) {
    return this.cityRepository.findOne({ where: { id } });
  }

  async getCitiesByStateId(stateId: number): Promise<City[]> {
    return this.cityRepository.find({ where: { state_id: stateId } });
  }
}
