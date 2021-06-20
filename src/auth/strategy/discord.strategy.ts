import { PassportStrategy } from '@nestjs/passport';
import {
    HttpService,
    Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord')
{
    constructor(
        private authService: AuthService,
        private http: HttpService,
    ) {
        super({
            authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify({
                client_id: process.env.DISCORD_CLIENT_ID,
                redirect_uri: process.env.DISCORD_CALLBACK,
                response_type: 'code',
                scope: 'identify'
            })}`,
            tokenURL: 'https://discordapp.com/api/oauth2/token',
            scope: 'identify',
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK
        });

    }

    async validate(accessToken: string): Promise<any> {
        const { data } = await this.http.get('https://discordapp.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).toPromise();
        return this.authService.findUserFromDiscordId(data.id);
    }
}
