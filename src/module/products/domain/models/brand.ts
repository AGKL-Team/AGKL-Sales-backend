import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Line } from './line';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  description: string;

  @OneToMany(() => Line, (line) => line.brand)
  lines: Line[];

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
}
