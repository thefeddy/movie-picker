import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, HttpService } from '@nestjs/common';

import { Response } from 'express';

import { ActorsService } from './actors.service';

@Controller('')
export class ActorsController {
    constructor(private actorsService: ActorsService, private http: HttpService) { }

    @Get('/:id')
    @Render('actors/index')
    async index(@Param('id') id: number, @Res() res: Response): Promise<any> {

        const response = await this.http.get(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const movies = await this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=${id}&with_watch_monetization_types=flatrate`).toPromise();

        const actor = { ...response.data, movies: movies.data.results };
        return { actor };
    }

}
