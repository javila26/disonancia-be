import { Vinyl } from 'src/vinyls/entities/vinyl.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  slug: string;

  @Column({
    default: '',
  })
  image: string;

  @OneToMany(() => Vinyl, (vinyl) => vinyl.category)
  vinyls: Vinyl[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeSlug() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
