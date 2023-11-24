import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findOne(id: number): Promise<User> {
        const user: User | null = await this.prismaService.user.findFirst({
            where: { id },
        });

        console.log(user);

        if (!user) throw new NotFoundException('There is no such user');

        return user;
    }

    public async update(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const user: User = await this.prismaService.user.update({
            where: {
                id,
            },
            data: { ...updateUserDto },
        });

        delete user.passwordHash;

        return user;
    }

    public async remove(id: number): Promise<User> {
        const user: User | null = await this.findOne(id);

        if (!user) throw new NotFoundException('There is no such user');

        await this.prismaService.user.delete({ where: { id } });

        return user;
    }
}
