import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import createConnectionOptions from '../../../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(createConnectionOptions)],
})
export class DatabaseModule {}
