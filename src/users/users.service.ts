import { Injectable, HttpException, HttpStatus, HttpService, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';

import { Users } from './users.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>
    ) { }

    async findUser(discord_id: string): Promise<any> {
        return await this.userRepository.find({
            where: { discord_id }
        });
    }
}
