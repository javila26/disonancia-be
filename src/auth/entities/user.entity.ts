import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: false,
    select: false,
  })
  password: string;

  @Column('text', {
    nullable: true,
  })
  fullName: string;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: [],
  })
  roles: string[];
}
