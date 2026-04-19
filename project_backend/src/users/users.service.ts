import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UserRegistrationDto } from '../auth/dto/user-registration.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    public async createUser(userRegistrationDTO:UserRegistrationDto)
    {
        const user = this.usersRepository.create(userRegistrationDTO);
        return await this.usersRepository.save(user);
    }

    public async findByEmail(email: string)
     {
        return this.usersRepository.findOne({ where: { email: email } });
    }

    public async findById(id: number)
    {
        return this.usersRepository.findOne({ where: { id: id } });
    }
}
