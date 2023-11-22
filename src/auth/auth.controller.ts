import { Body, Controller, Post } from '@nestjs/common';
import { AccessToken, AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    public signup(@Body() dto: SignupDto): Promise<AccessToken> {
        return this.authService.signup(dto);
    }

    @Post('login')
    public login(@Body() dto: LoginDto): Promise<AccessToken> {
        return this.authService.login(dto);
    }
}
