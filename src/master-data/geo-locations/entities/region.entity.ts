import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subregion } from './subregion.entity';

@Entity({ name: 'regions', schema: 'mst' })
export class Region {
  @PrimaryColumn({ type: 'bigint' }) // Not auto-generated
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  translations: string;

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

  // One region can have multiple subregions
  @OneToMany(() => Subregion, (subregion) => subregion.region)
  subregions: Subregion[];
}
