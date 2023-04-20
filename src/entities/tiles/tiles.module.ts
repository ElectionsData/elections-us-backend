import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from '../state/state.entity';
import { County } from '../county/county.entity';
import { TilesController } from './tiles.controller';
import { TilesService } from './tiles.service';
import { StateService } from '../state/state.service';
import { CountyService } from '../county/county.service';

@Module({
  imports: [TypeOrmModule.forFeature([State, County])],
  controllers: [TilesController],
  providers: [TilesService, StateService, CountyService],
})
export class TilesModule {}
