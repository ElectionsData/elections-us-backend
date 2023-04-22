import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateElectionSchema1624373989787 implements MigrationInterface {
  name = 'CreateElectionSchema1624373989787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS states (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        boundary geometry(MULTIPOLYGON, 4326)
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS counties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state_id INTEGER REFERENCES states(id) NOT NULL,
        boundary geometry(MULTIPOLYGON, 4326)
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state_id INTEGER REFERENCES states(id) NOT NULL,
        county_id INTEGER REFERENCES counties(id) NOT NULL,
        boundary geometry(POINT, 4326)
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS parties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        party_id INTEGER REFERENCES parties(id) NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS elections (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS state_election_results (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES elections(id) NOT NULL,
        state_id INTEGER REFERENCES states(id) NOT NULL,
        winner_id INTEGER REFERENCES candidates(id) NOT NULL,
        total_votes INTEGER NOT NULL,
        candidate_votes JSONB NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS county_election_results (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES elections(id) NOT NULL,
        county_id INTEGER REFERENCES counties(id) NOT NULL,
        winner_id INTEGER REFERENCES candidates(id) NOT NULL,
        total_votes INTEGER NOT NULL,
        candidate_votes JSONB NOT NULL
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS city_election_results (
        id SERIAL PRIMARY KEY,
        election_id INTEGER REFERENCES elections(id) NOT NULL,
        city_id INTEGER REFERENCES cities(id) NOT NULL,
        winner_id INTEGER REFERENCES candidates(id) NOT NULL,
        total_votes INTEGER NOT NULL,
        candidate_votes JSONB NOT NULL
      );`,
    );

    // Add indexes and constraints
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_states_boundary ON states USING GIST(boundary);',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_counties_boundary ON counties USING GIST(boundary);',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_cities_boundary ON cities USING GIST(boundary);',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_results ADD CONSTRAINT fk_state_election_results_elections FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_results ADD CONSTRAINT fk_state_election_results_states FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_results ADD CONSTRAINT fk_state_election_results_candidates FOREIGN KEY (winner_id) REFERENCES candidates(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_results ADD CONSTRAINT fk_county_election_results_elections FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_results ADD CONSTRAINT fk_county_election_results_counties FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_results ADD CONSTRAINT fk_county_election_results_candidates FOREIGN KEY (winner_id) REFERENCES candidates(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_results ADD CONSTRAINT fk_city_election_results_elections FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_results ADD CONSTRAINT fk_city_election_results_cities FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_results ADD CONSTRAINT fk_city_election_results_candidates FOREIGN KEY (winner_id) REFERENCES candidates(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS counties ADD CONSTRAINT fk_counties_states FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS cities ADD CONSTRAINT fk_cities_states FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS cities ADD CONSTRAINT fk_cities_counties FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes and constraints
    await queryRunner.query('DROP INDEX IF EXISTS idx_states_boundary;');
    await queryRunner.query('DROP INDEX IF EXISTS idx_counties_boundary;');
    await queryRunner.query('DROP INDEX IF EXISTS idx_cities_boundary;');
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_results DROP CONSTRAINT IF EXISTS fk_state_election_results_elections;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_results DROP CONSTRAINT IF EXISTS fk_county_election_results_elections;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_results DROP CONSTRAINT IF EXISTS fk_city_election_results_elections;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_results DROP CONSTRAINT IF EXISTS fk_state_election_results_states;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_results DROP CONSTRAINT IF EXISTS fk_county_election_results_counties;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_results DROP CONSTRAINT IF EXISTS fk_city_election_results_cities;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS states DROP CONSTRAINT IF EXISTS pk_states;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS counties DROP CONSTRAINT IF EXISTS pk_counties;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS cities DROP CONSTRAINT IF EXISTS pk_cities;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS parties DROP CONSTRAINT IF EXISTS pk_parties;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS candidates DROP CONSTRAINT IF EXISTS pk_candidates;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS elections DROP CONSTRAINT IF EXISTS pk_elections;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS state_election_results DROP CONSTRAINT IF EXISTS pk_state_election_results;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS county_election_results DROP CONSTRAINT IF EXISTS pk_county_election_results;',
    );
    await queryRunner.query(
      'ALTER TABLE IF EXISTS city_election_results DROP CONSTRAINT IF EXISTS pk_city_election_results;',
    );

    // Drop tables
    await queryRunner.query(
      'DROP TABLE IF EXISTS state_election_results CASCADE;',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS county_election_results CASCADE;',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS city_election_results CASCADE;',
    );
    await queryRunner.query('DROP TABLE IF EXISTS elections CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS candidates CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS parties CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS cities CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS counties CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS states CASCADE;');

    // Remove PostGIS extension
    await queryRunner.query('DROP EXTENSION IF EXISTS postgis;');
  }
}
