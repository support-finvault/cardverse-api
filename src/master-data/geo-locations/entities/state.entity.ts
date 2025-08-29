import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'states', schema: 'mst' })
export class State {
  @PrimaryColumn({ type: 'bigint' }) // Not auto-generated as per schema
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'bigint' })
  country_id: number;

  @Column({ type: 'char', length: 2 })
  country_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fips_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iso2: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  type: string;

  @Column({ type: 'integer', nullable: true })
  level: number;

  @Column({ type: 'integer', nullable: true })
  parent_id: number;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wikiDataId: string;
}
