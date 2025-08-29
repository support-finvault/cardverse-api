import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbstractEntity } from 'src/common';

@Entity({ name: 'user_keys', schema: 'app' })
export class UserKey extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.keys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: UserEntity;

  @Column({ name: 'public_key_pem', type: 'text' })
  publicKeyPem: string;

  @Column({ name: 'device_id', type: 'varchar', length: 255, nullable: true })
  deviceId?: string;
}
