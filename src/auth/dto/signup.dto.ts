import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}
