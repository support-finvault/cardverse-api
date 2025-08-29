import { Entity, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Address } from '../../address/entities/address.entity';

import { AbstractEntity } from '../../../common/enitities/abstract.entity';

@Entity({ name: 'nominee_details', schema: 'app' })
export class NomineeDetails extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.nominees, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  nomineeName: string;

  @Column({ type: 'varchar', length: 50 })
  relationship: string;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 10 })
  pan: string;

  @Column({ type: 'varchar', length: 12 })
  aadhaar: string;
}
