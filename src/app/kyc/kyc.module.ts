import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycEntity } from './entities/kyc.entity';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KycEntity, UserEntity])], // Register KYC entity with TypeORM
  controllers: [KycController], // Register KYC controller
  providers: [KycService], // Register KYC service
  exports: [KycService], // Export KYC service for other modules if needed
})
export class KycModule {}
