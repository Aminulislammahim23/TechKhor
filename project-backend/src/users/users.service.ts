import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    const existing = await this.repo.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}