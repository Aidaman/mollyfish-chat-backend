import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    public email?: string;

    @IsString()
    @IsOptional()
    public password?: string;

    @IsString()
    @IsOptional()
    public displayName?: string;

    @IsString()
    @IsOptional()
    public username?: string;
}
