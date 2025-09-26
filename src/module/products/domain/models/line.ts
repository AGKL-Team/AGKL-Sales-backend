import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audithory } from '../interfaces/audithory';
import { Brand } from './brand';
import { Product } from './product';

@Entity('lines')
export class Line implements Audithory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('int')
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.lines)
  brand: Brand;

  @OneToMany(() => Product, (product) => product.line)
  products: Product[];

  @Column('timestamptz')
  createdAt: Date;
  @Column('uuid')
  createdBy: string;
  @Column('timestamptz', { nullable: true })
  updatedAt: Date | null;
  @Column('uuid', { nullable: true })
  updatedBy: string | null;
  @Column('timestamptz', { nullable: true })
  deletedAt: Date | null;
  @Column('uuid', { nullable: true })
  deletedBy: string | null;

  /**
   * Changes the name of the line.
   * @param name - The new name for the line.
   */
  changeName(name: string) {
    this.name = name;
  }

  /**
   * Factory method to create a new Line instance.
   * @param name - The name of the line.
   * @returns A new instance of Line.
   */
  static create(name: string): Line {
    const line = new Line();
    line.name = name;
    return line;
  }
}
