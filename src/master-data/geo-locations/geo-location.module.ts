import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityController } from './controllers/cities.controller';
import { CountriesController } from './controllers/countries.controller';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { Region } from './entities/region.entity';
import { State } from './entities/state.entity';
import { Subregion } from './entities/subregion.entity';
import { CityService } from './services/city.service';
import { CountriesService } from './services/countries.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/app/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Country, Region, State, Subregion]),
    AuthModule,
    UsersModule,
  ],
  controllers: [CityController, CountriesController],
  providers: [CityService, CountriesService],
  exports: [CityService, CountriesService],
})
export class GeoLocationModule {}
