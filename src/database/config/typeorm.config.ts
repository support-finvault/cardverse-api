import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

require('dotenv').config({
  path: join(
    __dirname,
    `../../../.env${process.env.BUILD_ENV ? '.' : ''}${
      process.env.BUILD_ENV || ''
    }`,
  ),
});

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME,
  port: Number(process.env.RDS_PORT),
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  entities: [join(__dirname, '..', '..', '**', '*.entity.{js,ts}')],
  synchronize: Boolean(process.env.TYPEORM_SYNC),
};

module.exports = typeOrmConfig;
