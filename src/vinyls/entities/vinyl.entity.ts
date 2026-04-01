import { Category } from 'src/categories/entities/category.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VinylImage } from './vinyl-image.entity';

@Entity()
export class Vinyl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    default: false,
  })
  available: boolean;

  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  discount: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  purchasePrice: number;

  @Column({
    nullable: true,
  })
  artist: string;

  @Column({
    default: 1,
  })
  numberOfDiscs: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  year: number;

  @Column({
    default: 0,
  })
  stock: number;

  @Column({
    unique: true,
  })
  slug: string;

  @OneToMany(() => VinylImage, (image) => image.vinyl, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  images: VinylImage[];

  @ManyToOne(() => Category, (category) => category.vinyls, { eager: true })
  category: Category;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeSlug() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
