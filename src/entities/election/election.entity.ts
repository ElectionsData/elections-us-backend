import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Election {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  type: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;
}
