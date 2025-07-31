import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService implements OnModuleInit {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
