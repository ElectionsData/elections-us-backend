import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateElectionchema1624373989787 implements MigrationInterface {
  name = 'CreateElectionchema1624373989787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS state (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        boundary geometry(MULTIPOLYGON, 4326)
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS county (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state_id INTEGER REFERENCES state(id) NOT NULL,
        boundary geometry(MULTIPOLYGON, 4326)
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS city (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state_id INTEGER REFERENCES state(id) NOT NULL,
        county_id INTEGER REFERENCES county(id) NOT NULL,
        boundary geometry(POINT, 4326)
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS party (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS candidate (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        party_id INTEGER REFERENCES party(id) NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS election (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS state_election_result (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES election(id) NOT NULL,
        state_id INTEGER REFERENCES state(id) NOT NULL,
        winner_id INTEGER REFERENCES candidate(id) NOT NULL,
        total_votes INTEGER NOT NULL,
        candidate_votes JSONB NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS county_election_result (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES election(id) NOT NULL,
        county_id INTEGER REFERENCES county(id) NOT NULL,
        winner_id INTEGER REFERENCES candidate(id) NOT NULL,
        total_votes INTEGER NOT NULL,
        candidate_votes JSONB NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS city_election_result (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES election(id) NOT NULL,
        city_id INTEGER REFERENCES city(id) NOT NULL,
        winner_id INTEGER REFERENCES candidate(id) NOT NULL,
        total_votes INTEGER NOT NULL,
        candidate_votes JSONB NOT NULL
      );`,
    );

    // Add indexes and constraints
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_state_boundary ON state USING GIST(boundary);',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_county_boundary ON county USING GIST(boundary);',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_city_boundary ON city USING GIST(boundary);',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_result ADD CONSTRAINT fk_state_election_result_election FOREIGN KEY (election_id) REFERENCES election(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_result ADD CONSTRAINT fk_state_election_result_state FOREIGN KEY (state_id) REFERENCES state(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_result ADD CONSTRAINT fk_state_election_result_candidate FOREIGN KEY (winner_id) REFERENCES candidate(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_result ADD CONSTRAINT fk_county_election_result_election FOREIGN KEY (election_id) REFERENCES election(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_result ADD CONSTRAINT fk_county_election_result_county FOREIGN KEY (county_id) REFERENCES county(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_result ADD CONSTRAINT fk_county_election_result_candidate FOREIGN KEY (winner_id) REFERENCES candidate(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_result ADD CONSTRAINT fk_city_election_result_election FOREIGN KEY (election_id) REFERENCES election(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_result ADD CONSTRAINT fk_city_election_result_city FOREIGN KEY (city_id) REFERENCES city(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_result ADD CONSTRAINT fk_city_election_result_candidate FOREIGN KEY (winner_id) REFERENCES candidate(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county ADD CONSTRAINT fk_county_state FOREIGN KEY (state_id) REFERENCES state(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city ADD CONSTRAINT fk_city_state FOREIGN KEY (state_id) REFERENCES state(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city ADD CONSTRAINT fk_city_county FOREIGN KEY (county_id) REFERENCES county(id) ON DELETE CASCADE;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes and constraints
    await queryRunner.query('DROP INDEX IF EXISTS idx_state_boundary;');
    await queryRunner.query('DROP INDEX IF EXISTS idx_county_boundary;');
    await queryRunner.query('DROP INDEX IF EXISTS idx_city_boundary;');
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_result DROP CONSTRAINT IF EXISTS fk_state_election_result_election;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_result DROP CONSTRAINT IF EXISTS fk_county_election_result_election;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_result DROP CONSTRAINT IF EXISTS fk_city_election_result_election;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_result DROP CONSTRAINT IF EXISTS fk_state_election_result_state;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_result DROP CONSTRAINT IF EXISTS fk_county_election_result_county;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_result DROP CONSTRAINT IF EXISTS fk_city_election_result_city;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state DROP CONSTRAINT IF EXISTS pk_state;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county DROP CONSTRAINT IF EXISTS pk_county;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city DROP CONSTRAINT IF EXISTS pk_city;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS party DROP CONSTRAINT IF EXISTS pk_party;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS candidate DROP CONSTRAINT IF EXISTS pk_candidate;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS election DROP CONSTRAINT IF EXISTS pk_election;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_result DROP CONSTRAINT IF EXISTS pk_state_election_result;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_result DROP CONSTRAINT IF EXISTS pk_county_election_result;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_result DROP CONSTRAINT IF EXISTS pk_city_election_result;',
    );

    // Drop tables
    await queryRunner.query(
      'DROP TABLE IF EXISTS state_election_result CASCADE;',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS county_election_result CASCADE;',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS city_election_result CASCADE;',
    );
    await queryRunner.query('DROP TABLE IF EXISTS election CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS candidate CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS party CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS city CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS county CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS state CASCADE;');

    // Remove PostGIS extension
    await queryRunner.query('DROP EXTENSION IF EXISTS postgis;');
  }
}
