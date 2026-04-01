import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vinyl } from './vinyl.entity';

@Entity()
export class VinylImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  type: 'cover' | 'back' | 'gallery';

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.images, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  vinyl: Vinyl;
}
