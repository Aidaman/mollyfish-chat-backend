import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export type AccessToken = { access_token: string };

@Injectable()
export class AuthService {
    private readonly usernamePattern: RegExp =
        /^(?:[a-z0-9_](?:[a-z0-9-_])(?:[a-z0-9_]))/;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    private testUsername(username: string) {
        if (username.length < 8)
            throw new ForbiddenException('username is too short');

        if (username.length > 32)
            throw new ForbiddenException('username is too long');

        if (!username.match(this.usernamePattern))
            throw new ForbiddenException('username is not match the pattern');
    }

    public async login(dto: LoginDto): Promise<AccessToken | null> {
        this.testUsername(dto.username);

        const user: User | null = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) throw new ForbiddenException('email is incorrect');

        const usernameMatch: boolean = dto.username === user.username;
        if (!usernameMatch)
            throw new ForbiddenException('username is incorrect');

        const passwordMatch: boolean = await argon.verify(
            user.passwordHash,
            dto.password,
        );
        if (!passwordMatch)
            throw new ForbiddenException('password is incorrect');

        return this.signToken(user.id, user.email, user.username);
    }

    public async signup(dto: SignupDto): Promise<AccessToken | null> {
        this.testUsername(dto.username);

        const passwordHash: string = await argon.hash(dto.password);
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    displayName: dto.username,
                    passwordHash,
                },
            });

            return this.signToken(user.id, user.email, user.username);
        } catch (error: unknown) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new ForbiddenException(
                            'Credentials already taken',
                        );
                    default:
                        break;
                }
            } else throw error;
        }

        return null;
    }

    private async signToken(
        userId: number,
        email: string,
        username: string,
    ): Promise<AccessToken> {
        const payload = {
            sub: userId,
            email,
            username,
        };

        const secret: string = this.configService.get('JWT_SECRET');

        const token: string = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });

        return { access_token: token };
    }
}
