import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from "src/users/users.entity";
import { UserDetails } from "src/utils/types";

import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
    constructor(@InjectRepository(Users) private userRepo: Repository<Users>) { }

    async validateUser(details: UserDetails) {
        const { discordId } = details;
        const user = await this.userRepo.findOne({ discordId });
        if (user) {
            await this.userRepo.update({ discordId }, details);
            console.log('Updated');
            return user;
        }
        return this.createUser(details);
    }

    createUser(details: UserDetails) {
        const user = this.userRepo.create(details);
        return this.userRepo.save(user);
    }

    findUser(discordId: string): Promise<Users | undefined> {
        return this.userRepo.findOne({ discordId });
    }
}