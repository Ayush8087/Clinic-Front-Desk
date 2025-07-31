import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async onModuleInit() {
        const user = await this.usersService.findOne('frontdesk');
        if (!user) {
            console.log('Creating default user "frontdesk"...');
            await this.usersService.create('frontdesk', 'password');
            console.log('Default user created successfully.');
        }
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}