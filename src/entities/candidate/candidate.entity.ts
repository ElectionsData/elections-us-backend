import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Party } from '../party/party.entity';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Party, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'party_id' })
  party: Party;
}
