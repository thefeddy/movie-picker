import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, HttpService, UseGuards, Req } from '@nestjs/common';


import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

import { MovieService } from './movies.service';
import { MoviesDTO, CreateMovieDTO } from './movies.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';

const { Webhook, MessageBuilder } = require('discord-webhook-node');


@Controller('')
export class MoviesController {
    constructor(private movieService: MovieService, private http: HttpService) { }
    private hook = new Webhook(process.env.DISCORD_WEBHOOK);
    private secoond_Hook = new Webhook(process.env.DISCORD_WEBHOOK_SECOND);

    @Get('/')
    @Render('movies/index')
    async index(@Res() res: Response): Promise<any> { }

    @Get('/search/:search/:page')
    @Render('movies/search')
    async search(@Param('search') search: string, @Param('page') page: string): Promise<any> {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${search}&page=${page}&include_adult=false`;
        const movies = await this.http.get(url).toPromise();
        const pagination = {
            total: movies.data.total_pages,
            current: movies.data.page
        }


        return { movies: movies.data, search, pagination };
    }


    @Get('/trending')
    @Render('movies/trending')
    async trending(@Res() res: Response, @Req() request: Request): Promise<any> {
        const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}`;
        const trending = await this.http.get(url).toPromise();

        return { trending: trending.data };
    }

    @Get('/random')
    @Render('movies/random')
    @UseGuards(AuthGuard('discord'))
    async random(@Res() res: Response): Promise<any> {
        const movies = await this.movieService.findAllByUnWatched();
        const random = movies[Math.floor(Math.random() * movies.length)];

        return { api_key: process.env.TMDB_API_KEY, random: random.movie_id }
    }

    @Get('/movies/:watched')
    @Render('movies/movies')
    async movies(@Res() res: Response, @Param('watched') watched: string): Promise<any> {
        const watch = (watched === 'unwatched') ? 0 : 1;
        const total = await this.movieService.findAllCount(watch);
        return { api_key: process.env.TMDB_API_KEY, total, watch }
    }

    @Get('/movie/:id')
    @Render('movies/movie')
    async movie(@Param('id') id: number, @Res() res: Response): Promise<any> {
        const response = await this.http.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const trailer = await this.http.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const credits = await this.http.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const streaming = await this.http.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();

        const details = await this.movieService.findById(id);
        let watched;
        if (details) {
            watched = (details.watched == 0) ? false : true;
        }


        const movie = { ...response.data, ...trailer.data.results[0], ...credits.data, _id: id, details, watched, streams: streaming.data.results.US };

        return { movie };
    }

    @Post('/add')
    async create(@Body() moviePayload: CreateMovieDTO): Promise<any> {
        const movie = await this.movieService.add(moviePayload);
        return movie;
    }

    @Get('/list/:watched/:page')
    async list(@Res() res: Response, @Param('watched') watched: number, @Param('page') page: number): Promise<any> {
        const movies = await this.movieService.findAllByPage(watched, page);
        return res.status(HttpStatus.OK).json(movies);
    }

    @Put('/watched')
    async watched(@Body() moviePayload: MoviesDTO): Promise<any> {
        const movie = await this.movieService.watched(moviePayload);
        return movie;
    }

    @Post('/watching')
    async watching(@Body() movie: any): Promise<any> {
        this.hook.setUsername('The Sperg Usher');
        this.hook.setAvatar('https://images.squarespace-cdn.com/content/v1/5ea326bd59c52d46dc2bb35e/1593446964682-YPURHWC3MNR6G2ET32HB/ke17ZwdGBToddI8pDm48kEe_mcRrPi0owKsOEvri4DwUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYy7Mythp_T-mtop-vrsUOmeInPi9iDjx9w8K4ZfjXt2doZ2E4t9jBRCFFsxkL63Kq3EgCzpFZzMz_Zg0ELkfZg8CjLISwBs8eEdxAxTptZAUg/Movie+Ticket+Image.png?format=2500w');


        const embed = new MessageBuilder()
            .setTitle(`We are Currently watching : ${movie.title}`)
            .setURL(movie.url)
            .setColor('#00b0f4')
            .setDescription(`${movie.overview}`)
            .setImage(movie.poster)
            .setTimestamp();


        try {
            Promise.all([this.hook.send(embed), this.secoond_Hook.send(embed)]);

            return { status: 202, message: 'Web Hook Sent' };
        } catch (error) {
            return { error };
        }


    }

}
