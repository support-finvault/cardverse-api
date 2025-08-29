import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CreateNomineeDto } from './dto/create-nominee.dto';
import { UpdateNomineeDto } from './dto/update-nominee.dto';
import { NomineeDetails } from './entities/nominee-details.entity';

@Injectable()
export class NomineeService {
  constructor(
    @InjectRepository(NomineeDetails)
    private nomineeRepository: Repository<NomineeDetails>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userId: number, createNomineeDto: CreateNomineeDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const nominee = this.nomineeRepository.create({
      ...createNomineeDto,
      user,
    });
    return this.nomineeRepository.save(nominee);
  }

  async findAll(userId: number) {
    return this.nomineeRepository.find({
      where: { user: { id: userId }, is_active: true },
    });
  }

  async findOne(userId: number, id: number) {
    const nominee = await this.nomineeRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!nominee) throw new NotFoundException('Nominee not found');
    return nominee;
  }

  async update(userId: number, id: number, updateNomineeDto: UpdateNomineeDto) {
    const nominee = await this.findOne(userId, id);
    Object.assign(nominee, updateNomineeDto);
    return this.nomineeRepository.save(nominee);
  }

  async remove(userId: number, id: number) {
    const nominee = await this.findOne(userId, id);
    if (!nominee) throw new NotFoundException('Nominee not found');
    return this.nomineeRepository.update(
      { id: nominee.id },
      { is_active: false },
    );
  }
}
