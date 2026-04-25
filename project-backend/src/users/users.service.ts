import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  private toPublicUser(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  private async findOneEntity(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

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

  async findAll() {
    const users = await this.repo.find();
    return users.map((user) => this.toPublicUser(user));
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOne(id: number) {
    const user = await this.findOneEntity(id);
    return this.toPublicUser(user);
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.findOneEntity(id);
    const nextData = { ...data };

    if (typeof nextData.password === 'string' && nextData.password.trim()) {
      nextData.password = await bcrypt.hash(nextData.password, 10);
    } else {
      delete nextData.password;
    }

    Object.assign(user, nextData);
    const updatedUser = await this.repo.save(user);
    return this.toPublicUser(updatedUser);
  }

  async remove(id: number) {
    const user = await this.findOneEntity(id);
    const removedUser = await this.repo.remove(user);
    return this.toPublicUser(removedUser);
  }

  async createSeller(data: Pick<User, 'fullName' | 'email' | 'password'>) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const seller = await this.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: Role.SELLER,
    });

    return this.toPublicUser(seller);
  }

  async findSellers() {
    const sellers = await this.repo.find({
      where: { role: Role.SELLER },
      order: { createdAt: 'DESC' },
    });

    return sellers.map((seller) => this.toPublicUser(seller));
  }

  async removeSeller(id: number) {
    const seller = await this.repo.findOne({
      where: {
        id,
        role: Role.SELLER,
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    await this.repo.remove(seller);

    return {
      message: 'Seller deleted successfully',
    };
  }

  async setSellerMaintenanceAccess(id: number, enabled: boolean) {
    const seller = await this.repo.findOne({
      where: {
        id,
        role: Role.SELLER,
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    seller.canAccessDuringMaintenance = enabled;
    const saved = await this.repo.save(seller);
    return this.toPublicUser(saved);
  }
}
