import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from './dto';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, PrismaService, ConfigService, JwtService],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(async () => {
        prismaService.cleanDb();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should fail because username is shorter than 8 symbols', async () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'a';

            await expect(service.signup(dto)).rejects.toThrow(
                ForbiddenException,
            );
            await expect(service.signup(dto)).rejects.toThrow(
                'username is too short',
            );
        });

        it('should fail because username is greater than 32 symbols', async () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'abcdefghijklmnopqrstuvwxyz1234567890';

            await expect(service.signup(dto)).rejects.toThrow(
                ForbiddenException,
            );
            await expect(service.signup(dto)).rejects.toThrow(
                'username is too long',
            );
        });

        it('should fail because username does not match the pattern', async () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'AnInVaLiDuSeRnAme';

            await expect(service.signup(dto)).rejects.toThrow(
                ForbiddenException,
            );
            await expect(service.signup(dto)).rejects.toThrow(
                'username is not match the pattern',
            );
        });

        it('should signup', async () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'mollyfish';

            expect(service.signup(dto)).toBeTruthy();
        });
    });

    describe('login', () => {
        it('should fail because username is shorter than 8 symbols', async () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'a';

            await expect(service.login(dto)).rejects.toThrow(
                ForbiddenException,
            );
            await expect(service.login(dto)).rejects.toThrow(
                'username is too short',
            );
        });

        it('should fail because username is greater than 32 symbols', async () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'abcdefghijklmnopqrstuvwxyz1234567890';

            await expect(service.login(dto)).rejects.toThrow(
                ForbiddenException,
            );
            await expect(service.login(dto)).rejects.toThrow(
                'username is too long',
            );
        });

        it('should fail because username does not match the pattern', async () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'AnInVaLiDuSeRnAme';

            await expect(service.login(dto)).rejects.toThrow(
                ForbiddenException,
            );
            await expect(service.login(dto)).rejects.toThrow(
                'username is not match the pattern',
            );
        });

        it('should login', async () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'mollyfish';

            expect(service.login(dto)).toBeTruthy();
        });
    });
});
