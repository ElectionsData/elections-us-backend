import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from '../state/state.entity';
import { County } from '../county/county.entity';
import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';

@Injectable()
export class TilesService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(County)
    private readonly countyRepository: Repository<County>,
  ) {}

  async getStateTile(z: number, x: number, y: number): Promise<Buffer> {
    const states = await this.stateRepository.find();
    const layer = {
      name: 'states',
      extent: 4096,
      version: 2,
      features: states.map((state) => {
        return {
          id: state.id,
          geometry: state.boundary,
          tags: {
            name: state.name,
            electoral_votes: state.electoralVotes,
          },
        };
      }),
    };
    const vt = new VectorTile(new Protobuf(layer.extent));
    vt.addFeatures(layer.features, { version: layer.version });
    const buffer = vt.encodeSync();
    return buffer;
  }

  async getCountyTile(z: number, x: number, y: number): Promise<Buffer> {
    const counties = await this.countyRepository.find({
      relations: ['state'],
    });
    const layer = {
      name: 'counties',
      extent: 4096,
      version: 2,
      features: counties.map((county) => {
        return {
          id: county.id,
          geometry: county.boundary,
          tags: {
            name: county.name,
            state: county.state.name,
          },
        };
      }),
    };
    const vt = new VectorTile(new Protobuf(layer.extent));
    vt.addFeatures(layer.features, { version: layer.version });
    const buffer = vt.encodeSync();
    return buffer;
  }
}
