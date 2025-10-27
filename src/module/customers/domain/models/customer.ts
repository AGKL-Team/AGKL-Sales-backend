import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auditory } from './../../../core/auth/domain/interfaces/auditory';
import { Sale } from './../../../sales/domain/model/sale';

@Entity('customers')
export class Customer implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 50 })
  lastName: string;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales: Sale[];

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
   * Changes the name of the customer.
   * @param name - The new name for the customer.
   */
  changeName(name: string) {
    this.name = name;
  }

  /**
   * Changes the last name of the customer.
   * @param lastName - The new last name for the customer.
   */
  changeLastName(lastName: string) {
    this.lastName = lastName;
  }

  /**
   * Creates a new customer instance from the provided request.
   * @param name - The first name of the customer.
   * @param lastName - The last name of the customer.
   */
  static create(name: string, lastName: string): Customer {
    const customer = new Customer();
    customer.name = name;
    customer.lastName = lastName;

    return customer;
  }
}
