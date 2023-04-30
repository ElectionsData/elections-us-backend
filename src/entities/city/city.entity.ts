import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { State } from '../state/state.entity';
import { County } from '../county/county.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => County, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'county_id' })
  county: County;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  boundary: any;
}
