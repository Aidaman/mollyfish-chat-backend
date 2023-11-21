import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL'),
                },
            },
        });
    }

    public cleanDb() {
        return this.$transaction([
            this.user.deleteMany(),
            this.usersInRooms.deleteMany(),
            this.room.deleteMany(),
            this.message.deleteMany(),
        ]);
    }
}
