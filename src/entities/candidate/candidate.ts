import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Party } from '../party/party';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Party, { onDelete: 'CASCADE' })
  party: Party;
}
