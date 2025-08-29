// src/shared/encryption/encryption.module.ts

import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ConfigService } from '@nestjs/config';
import { EncryptionController } from './encryption.controller';

@Module({
  providers: [EncryptionService, ConfigService],
  controllers: [EncryptionController],
  exports: [EncryptionService],
})
export class EncryptionModule {}
