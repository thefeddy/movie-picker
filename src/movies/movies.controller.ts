import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, HttpService } from '@nestjs/common';

import { Response } from 'express';

import { MovieService } from './movies.service';
import { MoviesDTO, CreateMovieDTO, WatchedMovieDTO } from './movies.dto';

@Controller('')
export class MoviesController {
    constructor(private movieService: MovieService, private http: HttpService) { }

    @Get('/')
    @Render('movies/index')
    async index(@Res() res: Response): Promise<any> {

    }

    @Get('/search/:search')
    @Render('movies/search')
    async search(@Param('search') search: string, @Res() res: Response): Promise<any> {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`;
        const movies = await this.http.get(url).toPromise();
        console.log(movies.data)
        return { movies: movies.data, search: search };
    }

    @Get('/admin')
    @Render('movies/admin')
    async admin(@Res() res: Response): Promise<any> {

    }

    @Get('/random')
    @Render('movies/random')
    async random(@Res() res: Response): Promise<any> {
        return { api_key: process.env.TMDB_API_KEY }
    }

    @Get('/movies')
    @Render('movies/movies')
    async movies(@Res() res: Response): Promise<any> {
        return { api_key: process.env.TMDB_API_KEY }
    }

    @Get('/movie/:id')
    @Render('movies/movie')
    async movie(@Param('id') id: Number, @Res() res: Response): Promise<any> {
        const response = await this.http.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const trailer = await this.http.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&&language=en-US`).toPromise();
        const movie = { ...response.data, ...trailer.data.results[0], id };

        return { movie };
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
