import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Election } from '../election/election.entity';
import { State } from '../state/state.entity';
import { Candidate } from '../candidate/candidate.entity';

@Entity()
export class StateElectionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Election, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'election_id' })
  election: Election;

  @ManyToOne(() => State, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'winner_id' })
  winner: Candidate;

  @Column()
  total_votes: number;

  @Column('jsonb')
  candidate_votes: any;
}
