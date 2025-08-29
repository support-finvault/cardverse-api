import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NomineeDetails } from './entities/nominee-details.entity';
import { UserEntity } from '../users/entities/user.entity';
import { NomineeService } from './nominee.service';
import { NomineeController } from './nominee.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NomineeDetails, UserEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [NomineeController],
  providers: [NomineeService],
  exports: [NomineeService],
})
export class NomineeModule {}
