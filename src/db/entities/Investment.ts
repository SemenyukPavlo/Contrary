import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Investment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  companyName: string;

  @Column("float")
  amount: number;

  @Column()
  roundType: string;

  @Column()
  date: Date;

  @Column("float")
  valuation: number;
}
