import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Generated,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractEntity {
  @ApiProperty({ description: 'Auto-incremented primary key ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Universally Unique Identifier (UUID)' })
  @Column({ nullable: false })
  @Generated('uuid')
  alt_id: string;

  @ApiProperty({ description: 'Timestamp when the record was created' })
  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the record was last updated' })
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the record was deleted (soft delete)',
    nullable: true,
  })
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  deleted_on: Date;

  @ApiProperty({ description: 'Status of the record (active/inactive)' })
  @Column('bool', { default: true })
  is_active: boolean;
}
