import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, HttpService } from '@nestjs/common';

import { Response } from 'express';

import { UsersService } from './users.service';

@Controller('')
export class UsersController {
    constructor(private actorsService: UsersService, private http: HttpService) { }

    @Get('')
    @Render('actors/index')
    async index(@Param('id') id: number, @Res() res: Response): Promise<any> {

    }

}
