import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycEntity } from './entities/kyc.entity';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ValidationException } from '../../common/validation.exception';
import { ERROR_MESSAGES_COMMON } from '../../app.constants';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(KycEntity)
    private kycRepository: Repository<KycEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getKycByUser(userId: number): Promise<KycEntity[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new ValidationException(['User not found']);
    }

    const kycRecords = await this.kycRepository.find({
      where: { user: { id: userId }, is_active: true },
      relations: ['user'],
    });

    if (!kycRecords.length) {
      throw new ValidationException([
        'No active KYC records found for this user.',
      ]);
    }

    return kycRecords;
  }

  async createKyc(userId: number, createKycDto: CreateKycDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new ValidationException([
        'User not found. Cannot create KYC record.',
      ]);
    }

    const existingKyc = await this.kycRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingKyc) {
      throw new ValidationException([
        'User already has a KYC record. Update the existing record instead.',
      ]);
    }

    const kyc = this.kycRepository.create({ ...createKycDto, user });
    return this.kycRepository.save(kyc);
  }
  async updateKyc(
    userId: number,
    id: string,
    updateKycDto: UpdateKycDto,
  ): Promise<KycEntity> {
    const kyc = await this.kycRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });

    if (!kyc) {
      throw new ValidationException(['KYC record not found']);
    }

    if (kyc.user.id !== userId) {
      throw new ValidationException([
        'Unauthorized: You cannot update this KYC record',
      ]);
    }

    Object.assign(kyc, updateKycDto);
    return this.kycRepository.save(kyc);
  }

  async deactivateKyc(userId: number, id: string): Promise<KycEntity> {
    const kyc = await this.kycRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });

    if (!kyc) {
      throw new ValidationException(['KYC record not found']);
    }

    if (kyc.user.id !== userId) {
      throw new ValidationException([
        'Unauthorized: You cannot deactivate this KYC record',
      ]);
    }

    kyc.is_active = false;
    return this.kycRepository.save(kyc);
  }
}
