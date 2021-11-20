import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    async validateUser(discord_id: string): Promise<any> {
        const user = await this.usersService.findUser(discord_id);
        if (user) {
            return user;
        }
        return null;
    }
}
