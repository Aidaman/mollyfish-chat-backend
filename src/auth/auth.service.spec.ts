import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from './dto';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, PrismaService, ConfigService, JwtService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sign token', () => {
        it('should return valid token', async () => {
            const loginDto: LoginDto = new LoginDto();
            loginDto.email = 'email@example.com';
            loginDto.username = 'mollyfish';

            const mockToken: string =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Im1vbGx5ZmlzaCIsImVtYWlsIjoiZW1haWxAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.nVw2ySuG-hFJDVCRl1kq0eDNohZzdMMltSWBCafwMrU';
            const generatedToken: string = await service.signToken(
                1,
                loginDto.email,
                loginDto.username,
            );

            expect(generatedToken).toBe(mockToken);
        });
    });

    describe('login', () => {
        it('should fail because all data is empty', () => {
            expect(service.login(new LoginDto())).toBe(null);
        });

        it('should fail because email is not an email', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = '12345678';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because email is empty', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = '';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because password is not string', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = null;
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because password is empty', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because password is shorter than 8 symbols', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '123456';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is not string', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = null;
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is empty', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = '';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is shorter than 8 symbols', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'molly';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is greater than 32 symbols', () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'abcdefghijklmnopqrstuvwxyz1234567890';
            expect(service.login(dto)).toBe(null);
        });

        it('should login', async () => {
            const dto: LoginDto = new LoginDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'mollyfish';

            const token: string = await service.signToken(
                1,
                dto.email,
                dto.username,
            );

            expect(service.login(dto)).toHaveReturnedWith(token);
        });
    });

    describe('register', () => {
        it('should fail because all data is empty', () => {
            expect(service.login(new SignupDto())).toBe(null);
        });

        it('should fail because email is not an email', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = '12345678';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because email is empty', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = '';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because password is not string', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = null;
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because password is empty', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because password is shorter than 8 symbols', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '123456';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is not string', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = null;
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is empty', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = '';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is shorter than 8 symbols', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'molly';
            expect(service.login(dto)).toBe(null);
        });

        it('should fail because username is greater than 32 symbols', () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'abcdefghijklmnopqrstuvwxyz1234567890';
            expect(service.login(dto)).toBe(null);
        });

        it('should login', async () => {
            const dto: SignupDto = new SignupDto();
            dto.email = 'email@example.com';
            dto.password = '12345678';
            dto.username = 'mollyfish';

            const token: string = await service.signToken(
                1,
                dto.email,
                dto.username,
            );

            expect(service.login(dto)).toHaveReturnedWith(token);
        });
    });
});
