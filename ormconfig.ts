import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const createConnectionOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  synchronize: true,
  migrationsRun: true,
  entities: ['dist/src/**/*.entity.{js,ts}'],
};

export default createConnectionOptions;
