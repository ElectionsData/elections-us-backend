import { MigrationInterface, QueryRunner } from 'typeorm';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

export class AddHarvardData1682097649111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const stream = fs.createReadStream(__dirname + '/harvard.csv').pipe(
      csvParser({
        mapHeaders: ({ header }) => header.toLowerCase(),
      }),
    );

    // datasets with unique values
    const states = new Set();
    const parties = new Set();
    const candidates = new Set();
    const elections = new Set();

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
      if (!states.has(row.state)) {
        await queryRunner.query(
          `INSERT INTO state (name)
          SELECT '${row.state}'
          EXCEPT
          SELECT name FROM state`,
        );
        states.add(row.state);
      }

      // Add unique party to db
      if (!parties.has(row.party_simplified)) {
        await queryRunner.query(
          `INSERT INTO party (name)
          SELECT '${party}'
          EXCEPT
          SELECT name FROM party`,
        );
        parties.add(row.party_simplified);
      }

      // Add unique candidate to db
      if (!candidates.has(row.candidate + row.party_simplified)) {
        await queryRunner.query(
          `INSERT INTO candidate (name, party_id)
          SELECT '${candidate}', (SELECT id FROM party WHERE party.name = '${party}')
          EXCEPT
          SELECT name, party_id FROM candidate`,
        );
        candidates.add(row.candidate + row.party_simplified);
      }

      // Add unique election to db
      if (!elections.has(row.office + row.year)) {
        await queryRunner.query(
          `INSERT INTO election (name, type, year)
            SELECT 'U.S. President ${row.year}', 'Federal elections', ${row.year}
            EXCEPT
            SELECT name, type, year FROM election`,
        );
        elections.add(row.office + row.year);
      }

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
          const qStateId = `(SELECT id FROM state WHERE state.name = '${stateElectionResults.state}')`;
          const qCandidatePartyId = `(SELECT id FROM party WHERE party.name = '${winnerRow.party_simplified}')`;
          const qWinnerId = `(SELECT id FROM candidate WHERE candidate.name = '${winnerName}' AND candidate.party_id = ${qCandidatePartyId})`;

          await queryRunner.query(
            `INSERT INTO state_election_result (election_id, state_id, winner_id, total_votes, candidate_votes)
            SELECT ${qElectionId}, ${qStateId}, ${qWinnerId}, ${winnerRow.totalvotes}, json_build_object('a', 'b')`,
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
