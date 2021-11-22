import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';



import { DiscordStrategy } from './strategy/discord.strategy';
import { SessionSerializer } from './session.serializer';

import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';


@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Users]),
        PassportModule.register({ session: true }),
    ],
    providers: [
        AuthService,
        UsersService,
        DiscordStrategy,
        SessionSerializer
    ],
    controllers: [
        AuthController,
    ],
})
export class AuthModule {
}
