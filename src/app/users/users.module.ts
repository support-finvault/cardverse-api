import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserKey } from './entities/userKeys.entity';
import { PushToken } from './entities/push-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserKey, PushToken])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
