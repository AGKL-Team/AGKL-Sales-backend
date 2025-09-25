import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audithory } from '../interfaces/audithory';
import { Line } from './line';

@Entity('brands')
export class Brand implements Audithory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  description: string;

  @OneToMany(() => Line, (line) => line.brand)
  lines: Line[];

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

  addLine(line: Line): void {
    if (!this.lines) {
      this.lines = [];
    }

    if (!this.lines.find((l) => l.id === line.id)) {
      this.lines.push(line);
      line.brand = this;
    }
  }

  removeLine(line: Line): void {
    if (!this.lines) {
      return;
    }

    this.lines = this.lines.filter((l) => l.id !== line.id);
  }

  static create(name: string, description: string): Brand {
    const brand = new Brand();
    brand.name = name;
    brand.description = description;

    return brand;
  }
}
