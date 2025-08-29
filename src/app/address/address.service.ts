import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { State } from 'src/master-data/geo-locations/entities/state.entity';
import { Country } from 'src/master-data/geo-locations/entities/country.entity';
import { City } from 'src/master-data/geo-locations/entities/city.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<Address> {
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) throw new NotFoundException('User not found');

    const [country, state, city] = await Promise.all([
      this.countryRepository.findOne({
        where: { id: createAddressDto.countryId },
      }),
      this.stateRepository.findOne({ where: { id: createAddressDto.stateId } }),
      this.cityRepository.findOne({ where: { id: createAddressDto.cityId } }),
    ]);

    if (!country) throw new NotFoundException('Country not found');
    if (!state) throw new NotFoundException('State not found');
    if (!city) throw new NotFoundException('City not found');

    const existingAddress = await this.addressRepository.findOne({
      where: { user: { id: userId } },
      relations: ['property'],
    });

    if (existingAddress) {
      // Update existing address
      Object.assign(existingAddress, {
        ...createAddressDto,
        country,
        state,
        city,
      });

      return this.addressRepository.save(existingAddress);
    }

    // Else, create a new one
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
      country,
      state,
      city,
    });

    return this.addressRepository.save(address);
  }

  async findAllByUser(userId: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { id: userId } },
      relations: ['property', 'country', 'state', 'city'],
    });
  }

  async findOne(id: string, userId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: Number(id), user: { id: userId } },
      relations: ['property', 'country', 'state', 'city'],
    });

    if (!address) throw new NotFoundException('Address not found');

    return address;
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
    userId: number,
  ): Promise<Address> {
    const address = await this.findOne(id, userId);

    if (updateAddressDto.countryId) {
      const country = await this.countryRepository.findOne({
        where: { id: updateAddressDto.countryId },
      });
      if (!country) throw new NotFoundException('Country not found');
      address.country = country;
    }

    if (updateAddressDto.stateId) {
      const state = await this.stateRepository.findOne({
        where: { id: updateAddressDto.stateId },
      });
      if (!state) throw new NotFoundException('State not found');
      address.state = state;
    }

    if (updateAddressDto.cityId) {
      const city = await this.cityRepository.findOne({
        where: { id: updateAddressDto.cityId },
      });
      if (!city) throw new NotFoundException('City not found');
      address.city = city;
    }

    Object.assign(address, updateAddressDto);

    return this.addressRepository.save(address);
  }

  async remove(id: string, userId: number): Promise<void> {
    const address = await this.findOne(id, userId);
    await this.addressRepository.remove(address);
  }
}
