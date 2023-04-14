import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from './party.entity';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([Party])],
  controllers: [PartyController],
  providers: [PartyService],
})
export class PartyModule {}
