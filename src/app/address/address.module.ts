import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GeoLocationModule } from 'src/master-data';
import { City } from 'src/master-data/geo-locations/entities/city.entity';
import { Country } from 'src/master-data/geo-locations/entities/country.entity';
import { Region } from 'src/master-data/geo-locations/entities/region.entity';
import { State } from 'src/master-data/geo-locations/entities/state.entity';
import { Subregion } from 'src/master-data/geo-locations/entities/subregion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address,
      UserEntity,
      City,
      Country,
      Region,
      State,
      Subregion,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
