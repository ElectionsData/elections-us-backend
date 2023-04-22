import { MigrationInterface, QueryRunner } from 'typeorm';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

export class USPresident1976_2020_1682097649111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const stream = fs
      .createReadStream(__dirname + '/1682097649111-USPresident1976-2020.csv')
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => header.toLowerCase(),
        }),
      );

    // temporary variable, initial value
    const stateElectionResults = {
      year: 1976,
      state: 'ALABAMA',
      data: [],
    };

    for await (const row of stream) {
      const party = row.party_simplified.replaceAll("'", "''");
      const candidate = row.candidate.replaceAll("'", "''");

      // Add unique state to db
      await queryRunner.query(
        `INSERT INTO state (id, name)
          SELECT ${row.state_fips}, '${row.state}'
          EXCEPT SELECT id, name FROM state`,
      );

      // Add unique party to db
      await queryRunner.query(
        `INSERT INTO party (name)
          SELECT '${party}'
          EXCEPT SELECT name FROM party`,
      );

      // Add unique candidate to db
      await queryRunner.query(
        `INSERT INTO candidate (name, party_id)
          SELECT '${candidate}', (SELECT id FROM party WHERE party.name = '${party}')
          EXCEPT SELECT name, party_id FROM candidate`,
      );

      // Add unique election to db
      await queryRunner.query(
        `INSERT INTO election (name, type, year)
            SELECT 'U.S. President ${row.year}', 'Federal elections', ${row.year}
            EXCEPT SELECT name, type, year FROM election`,
      );

      // Add state election result to db
      await (async function addStateElectionResult() {
        if (
          stateElectionResults.state == row.state &&
          stateElectionResults.year == row.year
        ) {
          stateElectionResults.data.push(row);
        } else {
          const winnerRow = stateElectionResults.data.sort(
            (a, b) => b.candidatevotes - a.candidatevotes,
          )[0];

          const winnerName = winnerRow.candidate.replaceAll("'", "''");
          const qElectionId = `(SELECT id FROM election WHERE election.year = ${stateElectionResults.year})`;
          const qCandidatePartyId = `(SELECT id FROM party WHERE party.name = '${winnerRow.party_simplified}')`;
          const qWinnerId = `(SELECT id FROM candidate WHERE candidate.name = '${winnerName}' AND candidate.party_id = ${qCandidatePartyId})`;

          await queryRunner.query(
            `INSERT INTO state_election_result (election_id, state_id, winner_id, total_votes, candidate_votes)
            SELECT ${qElectionId}, ${winnerRow.state_fips}, ${qWinnerId}, ${winnerRow.totalvotes}, '{"":""}'::jsonb
            EXCEPT
            SELECT election_id, state_id, winner_id, total_votes, candidate_votes FROM state_election_result`,
          );

          stateElectionResults.state = row.state;
          stateElectionResults.year = row.year;
          stateElectionResults.data = [];
        }
      })();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
