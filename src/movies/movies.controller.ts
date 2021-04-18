import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put } from '@nestjs/common';

import { Response } from 'express';

import { MovieService } from './movies.service';
import { MoviesDTO, CreateMovieDTO, WatchedMovieDTO } from './movies.dto';

@Controller('')
export class MoviesController {
    constructor(private movieService: MovieService) { }

    @Get('/')
    @Render('movies/index')
    async index(@Res() res: Response): Promise<any> {

    }

    @Post('/add')
    async create(@Body() moviePayload: CreateMovieDTO): Promise<any> {
        const movie = await this.movieService.add(moviePayload);
        return movie;
    }

    @Get('/list')
    async list(@Res() res: Response): Promise<any> {
        const movies = await this.movieService.findAll();
        return res.status(HttpStatus.OK).json(movies);
    }

    @Put('/watched')
    async watched(@Body() moviePayload: MoviesDTO): Promise<any> {
        const movie = await this.movieService.watched(moviePayload);
        return movie;
    }

}
