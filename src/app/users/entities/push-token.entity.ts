import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbstractEntity } from 'src/common';

@Entity({ name: 'push_tokens', schema: 'app' })
export class PushToken extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.pushTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: UserEntity;

  @Column({ name: 'expo_push_token', type: 'varchar', length: 255 })
  @Index({ unique: true })
  expoPushToken: string;

  @Column({ name: 'device_id', type: 'varchar', length: 255 })
  @Index()
  deviceId: string;

  @Column({ name: 'device_type', type: 'varchar', length: 50, nullable: true })
  deviceType?: string; // e.g., "ios" | "android"

  @Column({ name: 'app_version', type: 'varchar', length: 50, nullable: true })
  appVersion?: string;

  @Column({
    name: 'last_active_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActiveAt: Date;
}
