import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOne(username: string): Promise<User | undefined> {
        return this.usersRepository.findOneBy({ username });
    }

    async create(username: string, pass: string): Promise<User> {
        const saltOrRounds = 10;
        const password = await bcrypt.hash(pass, saltOrRounds);
        const newUser = this.usersRepository.create({ username, password });
        return this.usersRepository.save(newUser);
    }
}