import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './entities/city/city.module';
import { StateModule } from './entities/state/state.module';
import { CountyModule } from './entities/county/county.module';
import { ElectionModule } from './entities/election/election.module';
import { PartyModule } from './entities/party/party.module';
import { CandidateModule } from './entities/candidate/candidate.module';
import { CityElectionResultModule } from './entities/city-election-result/city-election-result.module';
import { CountyElectionResultModule } from './entities/county-election-result/county-election-result.module';
import { StateElectionResultModule } from './entities/state-election-result/state-election-result.module';
import { TilesModule } from './entities/tiles/tiles.module';
import { dataSourceOptions } from './config/typeorm.config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    CityModule,
    StateModule,
    CountyModule,
    ElectionModule,
    PartyModule,
    CandidateModule,
    CityElectionResultModule,
    CountyElectionResultModule,
    StateElectionResultModule,
    TilesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
