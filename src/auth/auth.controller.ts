import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

import { Response } from 'express';

@Controller('')
export class AuthController {
    constructor(private usersService: UsersService) { }

    @Get('discord')
    @UseGuards(AuthGuard('discord'))
    async getUserFromDiscordLogin(@Req() req, @Res() res: Response): Promise<any> {
        console.log(res);
        // return res.redirect('/trending/');
    }
}