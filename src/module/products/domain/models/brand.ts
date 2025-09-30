import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auditory } from '../../../core/auth/domain/interfaces/auditory';
import { Line } from './line';

@Entity('brands')
export class Brand implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  description: string;

  @Column('varchar', { length: 1000, nullable: false })
  logoUrl: string;

  @Column('varchar', { length: 150, nullable: false })
  logoId: string;

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

  static create(
    name: string,
    logoUrl: string,
    logoId: string,
    description?: string,
  ): Brand {
    const brand = new Brand();
    brand.name = name;
    brand.logoUrl = logoUrl;
    brand.logoId = logoId;
    brand.description = description ?? '';

    return brand;
  }

  /**
   * Change the name of the brand
   * @param name New name for the brand
   */
  changeName(name: string): void {
    this.name = name;
  }

  /**
   * Change the description of the brand
   * @param description New description for the brand
   */
  changeDescription(description: string): void {
    this.description = description;
  }

  /**
   * Change the logo of the brand
   * @param logo New logo URL for the brand
   */
  changeLogo(logo: string): void {
    this.logoUrl = logo;
  }

  /**
   * Add a line to the brand
   * @param line Line to be added to the brand
   */
  addLine(line: Line): void {
    if (!this.lines) {
      this.lines = [];
    }

    if (
      !this.lines.find((l) => l.name.toLowerCase() === line.name.toLowerCase())
    ) {
      this.lines.push(line);
      line.brand = this;
    }
  }

  /**
   * Remove a line from the brand
   * @param line Line to be removed from the brand
   */
  removeLine(line: Line): void {
    if (!this.lines) {
      return;
    }

    this.lines = this.lines.filter((l) => l.id !== line.id);
  }
}
