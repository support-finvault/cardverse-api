import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'countries', schema: 'mst' })
export class Country {
  @PrimaryColumn({ type: 'bigint' }) // Not auto-generated
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'char', length: 3, nullable: true })
  iso3: string;

  @Column({ type: 'char', length: 3, nullable: true })
  numeric_code: string;

  @Column({ type: 'char', length: 2, nullable: true })
  iso2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phonecode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  capital: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currency_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currency_symbol: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tld: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @Column({ type: 'bigint', nullable: true })
  region_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subregion: string;

  @Column({ type: 'bigint', nullable: true })
  subregion_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nationality: string;

  @Column({ type: 'text', nullable: true })
  timezones: string;

  @Column({ type: 'text', nullable: true })
  translations: string;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  emoji: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  emojiU: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
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
