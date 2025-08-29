import { Entity, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/enitities/abstract.entity';
import { Country } from 'src/master-data/geo-locations/entities/country.entity';
import { State } from 'src/master-data/geo-locations/entities/state.entity';
import { City } from 'src/master-data/geo-locations/entities/city.entity';

@Entity({ name: 'address', schema: 'app' })
export class Address extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  addressLine1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressLine2?: string;

  @ManyToOne(() => Country, { nullable: false })
  country: Country;

  @ManyToOne(() => State, { nullable: false })
  state: State;

  @ManyToOne(() => City, { nullable: false })
  city: City;

  @Column({ type: 'varchar', length: 10 })
  pincode: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;
}
