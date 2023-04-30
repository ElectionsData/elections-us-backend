import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Election } from '../election/election.entity';
import { City } from '../city/city.entity';
import { Candidate } from '../candidate/candidate.entity';

@Entity()
export class CityElectionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Election, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'election_id' })
  election: Election;

  @ManyToOne(() => City, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'winner_id' })
  winner: Candidate;

  @Column()
  total_votes: number;

  @Column('jsonb')
  candidate_votes: Record<number, number>;
}
