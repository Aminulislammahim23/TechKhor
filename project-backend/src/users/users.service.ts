import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Role, User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
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
    const nextData = { ...data };
    if (nextData.phone !== undefined) {
      nextData.phone = this.normalizePhone(String(nextData.phone)) || null;
    }

    const role = nextData.role || Role.CUSTOMER;
    const normalizedPhone = nextData.phone;
    if (role === Role.CUSTOMER) {
      if (!normalizedPhone) {
        throw new BadRequestException('Customer phone is required');
      }

      if (normalizedPhone.length < 4) {
        throw new BadRequestException('Customer phone is invalid');
      }
    }

    const existing = await this.repo.findOne({
      where: { email: nextData.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    if (nextData.phone) {
      const existingPhone = await this.repo.findOne({
        where: { phone: nextData.phone },
      });

      if (existingPhone) {
        throw new ConflictException('Phone already exists');
      }
    }

    const user = this.repo.create(nextData);
    return this.repo.save(user);
  }

  async findAll() {
    const users = await this.repo.find();
    return users.map((user) => this.toPublicUser(user));
  }

  normalizePhone(phone: string) {
    return String(phone || '').replace(/[^\d+]/g, '').trim();
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async lookupCustomerByPhone(phone: string) {
    const normalizedPhone = this.normalizePhone(phone);

    if (normalizedPhone.length < 4) {
      return {
        found: false,
        customer: null,
        purchaseCount: 0,
        discountRate: 0,
      };
    }

    const customer = await this.repo.findOne({
      where: {
        phone: normalizedPhone,
        role: Role.CUSTOMER,
      },
    });

    if (!customer) {
      return {
        found: false,
        customer: null,
        purchaseCount: 0,
        discountRate: 0.03,
      };
    }

    const purchaseCount = await this.countPaidCustomerOrders(customer.id);

    return {
      found: true,
      customer: this.toPublicUser(customer),
      purchaseCount,
      discountRate: purchaseCount > 0 ? 0.05 : 0.03,
    };
  }

  async findOrCreatePosCustomer(fullName: string, phone: string) {
    const normalizedPhone = this.normalizePhone(phone);
    const normalizedName = String(fullName || '').trim();

    if (!normalizedName) {
      throw new BadRequestException('Customer name is required');
    }

    if (!normalizedPhone) {
      throw new BadRequestException('Customer phone is required');
    }

    const existing = await this.repo.findOne({
      where: {
        phone: normalizedPhone,
        role: Role.CUSTOMER,
      },
    });

    if (existing) {
      const purchaseCount = await this.countPaidCustomerOrders(existing.id);
      return {
        customer: existing,
        purchaseCount,
        discountRate: purchaseCount > 0 ? 0.05 : 0.03,
      };
    }

    const password = await bcrypt.hash(
      `${normalizedPhone}-${Date.now()}-${Math.random()}`,
      10,
    );

    const emailPhonePart = normalizedPhone.replace(/\D/g, '') || String(Date.now());
    const customer = this.repo.create({
      fullName: normalizedName,
      email: `pos-${emailPhonePart}@techkhor.local`,
      phone: normalizedPhone,
      password,
      role: Role.CUSTOMER,
    });

    const saved = await this.repo.save(customer);

    return {
      customer: saved,
      purchaseCount: 0,
      discountRate: 0.03,
    };
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

    if (nextData.phone !== undefined) {
      nextData.phone = this.normalizePhone(String(nextData.phone)) || null;

      if (nextData.phone) {
        const existingPhone = await this.repo.findOne({
          where: {
            phone: nextData.phone,
            id: Not(id),
          },
        });

        if (existingPhone) {
          throw new ConflictException('Phone already exists');
        }
      }
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

  private countPaidCustomerOrders(customerId: number) {
    return this.orderRepo.count({
      where: {
        customer: { id: customerId },
        status: 'paid',
      },
    });
  }
}
