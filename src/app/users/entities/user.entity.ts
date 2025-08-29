import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AbstractEntity } from '../../../common/enitities/abstract.entity';
import { KycEntity } from '../../kyc/entities/kyc.entity';
import { Address } from '../../address/entities/address.entity';
import { NomineeDetails } from '../../nominee-details/entities/nominee-details.entity';
import { UserKey } from './userKeys.entity';
import { PushToken } from './push-token.entity';
@Entity({ name: 'users', schema: 'app' })
export class UserEntity extends AbstractEntity {
  @ApiProperty({ type: () => [KycEntity], description: 'User KYC details' })
  @OneToMany(() => KycEntity, (kyc) => kyc.user)
  kyc: KycEntity[];

  @ApiProperty({ type: () => [Address], description: 'User addresses' })
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @ApiProperty({ type: () => [NomineeDetails], description: 'User nominees' })
  @OneToMany(() => NomineeDetails, (nominee) => nominee.user)
  nominees: NomineeDetails[];

  @ApiProperty({ description: 'First name of the user', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @ApiProperty({ description: 'Email address of the user', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ApiProperty({ description: 'Phone number of the user', nullable: true })
  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @ApiProperty({
    description: 'User ID from authentication provider',
    nullable: true,
  })
  @Column({ type: 'varchar', unique: true })
  authUserId: string;

  @OneToMany(() => UserKey, (userKey) => userKey.user)
  keys: UserKey[];

  @OneToMany(() => PushToken, (token) => token.user)
  pushTokens: PushToken[];
}
