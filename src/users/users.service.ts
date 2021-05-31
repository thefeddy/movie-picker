import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
    private readonly users: User[];

    constructor() {
        // change one of the below discord_id to your Discord ID, else you'll never be able to log in
        this.users = [
            {
                userId: 1,
                name: 'Bubonix#1062',
                discord_id: '49351078080155648',
            }
        ];
    }

    async findOne(
        field: string,
        discordId: string,
    ): Promise<User | undefined> {
        return this.users.find(user => user[field] === discordId);
    }
}
