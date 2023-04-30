import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { State } from '../state/state.entity';

@Entity()
export class County {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column('geometry', { spatialFeatureType: 'MultiPolygon', srid: 4326 })
  boundary: any;
}
