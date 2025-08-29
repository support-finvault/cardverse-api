import { Entity, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/enitities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum KYCStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity({ name: 'kyc', schema: 'app' })
export class KycEntity extends AbstractEntity {
  @ApiProperty({
    description: 'User associated with this KYC record',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.kyc, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ApiProperty({ description: 'PAN number of the user', maxLength: 10 })
  @Column({ type: 'varchar', length: 10, unique: true })
  pan: string;

  @ApiProperty({ description: 'Aadhaar number of the user', maxLength: 12 })
  @Column({ type: 'varchar', length: 12, unique: true })
  aadhaar: string;

  @ApiProperty({
    description: 'KYC verification status',
    enum: KYCStatus,
    default: KYCStatus.PENDING,
  })
  @Column({ type: 'enum', enum: KYCStatus, default: KYCStatus.PENDING })
  verified: KYCStatus;
}
