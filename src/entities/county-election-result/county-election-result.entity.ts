import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Election } from '../election/election.entity';
import { County } from '../county/county.entity';
import { Candidate } from '../candidate/candidate.entity';

@Entity()
export class CountyElectionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Election, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'election_id' })
  election: Election;

  @ManyToOne(() => County, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'county_id' })
  county: County;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'winner_id' })
  winner: Candidate;

  @Column()
  total_votes: number;

  @Column('jsonb')
  candidate_votes: Record<string, number>;
}
