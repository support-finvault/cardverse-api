import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/app/users/users.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
