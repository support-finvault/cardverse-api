import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'cities', schema: 'mst' })
export class City {
  @PrimaryColumn({ type: 'bigint' }) // Not auto-generated as per schema
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: false })
  state_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  state_code: string;

  @Column({ type: 'bigint', nullable: false })
  country_id: number;

  @Column({ type: 'char', length: 2, nullable: false })
  country_code: string;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: false })
  latitude: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: false })
  longitude: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => "'2014-01-01 12:01:01'",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'smallint', default: 1, nullable: false })
  flag: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wikiDataId?: string;
}
