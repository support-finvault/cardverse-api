import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { JwtAuthGuard } from './guards/jwt-guard/jwt-auth-guard';
import { RoleGuard } from './guards/role-guard/role.guard';
import { PuppeteerModule } from 'nest-puppeteer';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthMiddleware, DecryptionMiddleware } from './shared/middleware';
import { LoggerModule } from './logger/logger.module';
import { MailersModule } from './mailers/mailers.module';
import { MailModule } from './mails/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './app/users/users.module';
import { KycModule } from './app/kyc/kyc.module';
import { AddressModule } from './app/address/address.module';
import { NomineeModule } from './app/nominee-details/nominee.module';
import { EncryptionModule } from './shared/encryption/encryption.module';
import { NotificationModule } from './app/notifications/notification.module';
import { MessageeBrokerModule } from './message-broker/message-broker.module';
import { S3Module } from './s3/s3.module';

// import { mongoDBOptions } from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: `.env${process.env.BUILD_ENV ? '.' : ''}${
        process.env.BUILD_ENV || ''
      }`,
    }),
    process.env.ENABLE_SSL == '1'
      ? PuppeteerModule.forRoot({
          pipe: false,
          executablePath: '/usr/bin/chromium-browser',
        })
      : PuppeteerModule.forRoot({ pipe: false }),
    ScheduleModule.forRoot(),
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password:
              process.env.ENABLE_SSL == '1'
                ? configService.get('REDIS_PWD')
                : null,
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('RDS_HOSTNAME'),
          port: Number(configService.get('RDS_PORT')),
          username: configService.get('RDS_USERNAME'),
          password: configService.get('RDS_PASSWORD'),
          database: configService.get('RDS_DB_NAME'),
          entities: [join(__dirname, '**', '*.entity.{js,ts}')],
          synchronize: Boolean(configService.get('TYPEORM_SYNC')),
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    MailersModule,
    MailModule,
    AuthModule,
    UsersModule,
    KycModule,
    AddressModule,
    NomineeModule,
    EncryptionModule,
    NotificationModule,
    MessageeBrokerModule,
    S3Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  static isEncryptionEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    AppModule.isEncryptionEnabled =
      this.configService.get('ENCRYPTION_ENABLED') === 'true';
  }

  configure(consumer: MiddlewareConsumer): void {
    if (AppModule.isEncryptionEnabled) {
      consumer
        .apply(DecryptionMiddleware)
        .forRoutes(
          { path: '*', method: RequestMethod.POST },
          { path: '*', method: RequestMethod.PUT },
          { path: '*', method: RequestMethod.PATCH },
        );
    }

    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
