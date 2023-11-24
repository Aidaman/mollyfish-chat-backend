import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { LoginDto, SignupDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

describe('App e2e', () => {
    const apiUrl: string = 'http://localhost:3333';
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

        await app.init();
        await app.listen(3333);

        prismaService = app.get(PrismaService);
        prismaService.cleanDb();
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        const signupDto: SignupDto = {
            email: 'email@email.com',
            password: '12345678',
            username: 'username',
        };
        const loginDto: LoginDto = {
            email: 'email@email.com',
            password: '12345678',
            username: 'username',
        };

        describe('Signup', () => {
            it('should throw if no dto provided', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/signup`)
                    .withBody({})
                    .expectStatus(400);
            });
            it('should throw if email is empty', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/signup`)
                    .withBody({ ...signupDto, email: '' })
                    .expectStatus(400);
            });
            it('should throw if password is empty', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/signup`)
                    .withBody({ ...signupDto, password: '' })
                    .expectStatus(400);
            });
            it('should throw if password is not a string', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/signup`)
                    .withBody({ ...signupDto, password: null })
                    .expectStatus(400);
            });
            it('should throw if username is empty', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/signup`)
                    .withBody({ ...signupDto, username: '' })
                    .expectStatus(400);
            });
            it('should throw if username is not a string', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/signup`)
                    .withBody({ ...signupDto, username: null })
                    .expectStatus(400);
            });
            it('should signup', () => {
                return pactum
                    .spec()
                    .post('http://localhost:3333/auth/signup')
                    .withBody(signupDto)
                    .stores('accessToken', 'access_token')
                    .expectStatus(201);
            });
        });
        describe('Login', () => {
            it('should throw if no dto provided', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/login`)
                    .withBody({})
                    .expectStatus(400);
            });
            it('should throw if email is empty', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/login`)
                    .withBody({ ...loginDto, email: '' })
                    .expectStatus(400);
            });
            it('should throw if password is empty', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/login`)
                    .withBody({ ...loginDto, password: '' })
                    .expectStatus(400);
            });
            it('should throw if password is not a string', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/login`)
                    .withBody({ ...loginDto, password: null })
                    .expectStatus(400);
            });
            it('should throw if username is empty', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/login`)
                    .withBody({ ...loginDto, username: '' })
                    .expectStatus(400);
            });
            it('should throw if username is not a string', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/login`)
                    .withBody({ ...loginDto, username: null })
                    .expectStatus(400);
            });
            it('should login', () => {
                return pactum
                    .spec()
                    .post(`${apiUrl}/auth/login`)
                    .withBody(loginDto)
                    .stores('accessToken', 'access_token')
                    .expectStatus(201);
            });
        });
    });

    describe('User', () => {
        it('should fail because token is incorrect or empty', () => {
            return pactum.spec().get(`${apiUrl}/user`).expectStatus(401);
        });
        it('should return current user', () => {
            return pactum
                .spec()
                .get(`${apiUrl}/user`)
                .withHeaders('Authorization', 'Bearer $S{accessToken}')
                .expectStatus(200)
                .expectBodyContains('id');
        });
        it('should should edit the user and return the copy of result', () => {
            const editUserDto: UpdateUserDto = {
                email: 'updated@email.com',
            };
            return pactum
                .spec()
                .patch(`${apiUrl}/user`)
                .withBody(editUserDto)
                .withHeaders('Authorization', 'Bearer $S{accessToken}')
                .expectStatus(200);
        });
        it('should should remove the user and return what been deleted', () => {
            return pactum
                .spec()
                .delete(`${apiUrl}/user`)
                .withHeaders('Authorization', 'Bearer $S{accessToken}')
                .expectStatus(200);
        });
    });
});
