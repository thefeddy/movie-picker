import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, HttpService } from '@nestjs/common';

import { Response } from 'express';

import { MovieService } from './movies.service';




@Controller('')
export class MoviesController {
    constructor(private movieService: MovieService, private http: HttpService) { }

    @Get('/')
    @Render('index')
    async index(@Res() res: Response): Promise<any> { }

}
