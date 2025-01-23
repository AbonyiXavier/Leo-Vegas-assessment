import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { DataSource } from 'typeorm';
import { createConnection } from 'mysql2/promise';
import { Users } from '../../../../src/domains/users/entities/user.entity';

let mysqlContainer: StartedMySqlContainer;
let mysqlClient: any;
let mysqlDataSource: DataSource;

beforeAll(async () => {
  mysqlContainer = await new MySqlContainer().start();

  mysqlClient = await createConnection({
    host: mysqlContainer.getHost(),
    port: mysqlContainer.getPort(),
    database: mysqlContainer.getDatabase(),
    user: mysqlContainer.getUsername(),
    password: 'test',
  });

  let connected = false;
  const maxRetries = 5;
  let attempts = 0;

  while (!connected && attempts < maxRetries) {
    try {
      await mysqlClient.query('SELECT 1');
      connected = true;
      console.log('Successfully connected to the database.');
    } catch (err) {
      attempts++;
      console.log(
        `Database connection attempt ${attempts} failed, retrying...`,
      );
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  if (!connected) {
    throw new Error('Failed to connect to the test database');
  }

  const databaseUrl = `mysql://${mysqlContainer.getUsername()}:test@${mysqlContainer.getHost()}:${mysqlContainer.getPort()}/${mysqlContainer.getDatabase()}`;

  mysqlDataSource = new DataSource({
    type: 'mysql',
    url: databaseUrl,
    entities: [Users],
    synchronize: true,
    logging: true,
  });

  await mysqlDataSource.initialize();
  console.log('Successfully connected to test database...');
});

afterAll(async () => {
  await mysqlDataSource.destroy();
  await mysqlClient.end();
  await mysqlContainer.stop();
  console.log('...Test database stopped...');
});

jest.setTimeout(30000);
export { mysqlClient, mysqlDataSource };
