import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationException } from 'src/common/validation.exception';
import { CreateUserKeyDto } from './dto/create-user-key.dto';
import { UserKey } from './entities/userKeys.entity';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { PushToken } from './entities/push-token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserKey)
    private readonly userkeyRepository: Repository<UserKey>,
    @InjectRepository(PushToken)
    private readonly pushTokenRepository: Repository<PushToken>,
  ) {}

  async createMinimalUser(
    authUserId: string,
    email?: string,
    phone?: string,
  ): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: { authUserId },
    });

    if (!user) {
      user = this.userRepository.create({ authUserId, email, phone });
      user = await this.userRepository.save(user);
    }
    return user;
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: ['kyc', 'addresses', 'nominees'],
    });
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['kyc', 'addresses', 'nominees'],
    });

    if (!user) {
      throw new ValidationException(['User not found']);
    }

    return user;
  }

  async findOneByProviderAuthId(authId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { authUserId: authId },
      relations: ['kyc', 'addresses', 'nominees', 'keys'],
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.userRepository.update(id, { is_active: false });
    return { message: 'User deleted successfully' };
  }

  // inject UserKeyRepository in constructor if not already
  async registerUserPublicKey(userId: number, dto: CreateUserKeyDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userKey = this.userkeyRepository.create({
      user,
      publicKeyPem: dto.publicKeyPem,
      deviceId: dto.deviceId,
    });

    return this.userkeyRepository.save(userKey);
  }

  async registerPushToken(userId: number, dto: RegisterPushTokenDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.pushTokenRepository.findOne({
      where: {
        user: { id: userId },
        deviceId: dto.deviceId,
      },
    });

    if (existing) {
      existing.expoPushToken = dto.expoPushToken;
      existing.deviceType = dto.deviceType;
      existing.appVersion = dto.appVersion;
      return this.pushTokenRepository.save(existing);
    }

    const token = this.pushTokenRepository.create({
      user,
      expoPushToken: dto.expoPushToken,
      deviceId: dto.deviceId,
      deviceType: dto.deviceType,
      appVersion: dto.appVersion,
    });

    return this.pushTokenRepository.save(token);
  }
}
