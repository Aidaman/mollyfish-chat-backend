import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    public async login(dto: LoginDto): Promise<void> {}

    public async signup(dto: SignupDto): Promise<void> {}

    public async signToken(
        userId: number,
        email: string,
        username: string,
    ): Promise<string> {
        return '';
    }
}
