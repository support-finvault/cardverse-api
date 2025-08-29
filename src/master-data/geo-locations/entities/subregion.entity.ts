import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Region } from './region.entity';

@Entity({ name: 'subregions', schema: 'mst' })
export class Subregion {
  @PrimaryColumn({ type: 'bigint' }) // Not auto-generated
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  translations: string;

  @Column({ type: 'bigint', nullable: false })
  region_id: number;

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

  // Relationship with Region
  @ManyToOne(() => Region, (region) => region.subregions)
  region: Region;
}
