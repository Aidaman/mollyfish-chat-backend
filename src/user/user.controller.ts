import {
    Controller,
    Get,
    Body,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    public findCurrentUser(@GetUser('id') userId: number) {
        return this.userService.findOne(+userId);
    }

    @Patch()
    public update(
        @GetUser('id') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(+userId, updateUserDto);
    }

    @Delete()
    public remove(@GetUser('id') userId: number) {
        return this.userService.remove(+userId);
    }
}
