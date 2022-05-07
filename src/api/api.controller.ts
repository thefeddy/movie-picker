const { Webhook, MessageBuilder } = require('discord-webhook-node');

import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, HttpService } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

/* Services */

import { MovieService } from 'src/movies/movies.service';
/* DTOS */
import { MoviesDTO, CreateMovieDTO, WatchedMovieDTO } from '../movies/movies.dto';



@Controller('')
export class APIController {

    private hook = new Webhook(process.env.DISCORD_WEBHOOK);
    private secoond_Hook = new Webhook(process.env.DISCORD_WEBHOOK_SECOND);

    constructor(private http: HttpService, private movieService: MovieService) { }

    /* Search */
    @Get('/search/:type/:search/:page')
    async search(@Param('search') search: string, @Param('page') page: string, @Res() res: Response): Promise<any> {
        const url = `${process.env.TMDB_BASE_URL}search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${search}&page=${page}&include_adult=false`;
        const movies = await this.http.get(url).toPromise();
        const pagination = {
            total: movies.data.total_pages,
            current: movies.data.page
        }
        res.status(HttpStatus.OK).json({ movies: movies.data, search, pagination });
    }

    @Get('/trending')
    async trending(@Res() res: Response): Promise<any> {
        const url = `${process.env.TMDB_BASE_URL}trending/movie/day?api_key=${process.env.TMDB_API_KEY}`;
        const trending = await this.http.get(url).toPromise();

        res.status(HttpStatus.OK).json({ trending: trending.data });

    }


    @Get('/random')
    async random(@Res() res: Response): Promise<any> {
        const movies = await this.movieService.findAllByUnWatched();
        const random = movies[Math.floor(Math.random() * movies.length)];
        const movie = await this.http.get(`${process.env.TMDB_BASE_URL}movie/${random.movie_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();

        res.status(HttpStatus.OK).json(movie.data);
    }

    /* Movie Calls */
    @Get('/movie/details/:id')
    async movie(@Param('id') id: number, @Res() res: Response): Promise<any> {
        const response = await this.http.get(`${process.env.TMDB_BASE_URL}movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const trailer = await this.http.get(`${process.env.TMDB_BASE_URL}movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const credits = await this.http.get(`${process.env.TMDB_BASE_URL}movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const streaming = await this.http.get(`${process.env.TMDB_BASE_URL}movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();

        const detail = await this.movieService.findById(id);
        const details = { ...response.data, ...trailer.data.results[0], ...credits.data, _id: id, detail, streams: streaming.data.results.US };

        res.status(HttpStatus.OK).json({ details });
    }


    @Get('/movie/list/:status/:page')
    async list(@Res() res: Response, @Param('status') status: string, @Param('page') page: number): Promise<any> {
        const watched = (status === 'unwatched') ? 0 : 1;
        const movies = await this.movieService.findAllByPage(watched, page);
        const total = await this.movieService.findAllCount(watched);
        let details = [];

        for (const movie of movies) {
            let detail = await this.http.get(`${process.env.TMDB_BASE_URL}movie/${movie.movie_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
            details.push(detail.data);
        }
        console.log(details);
        return res.status(HttpStatus.OK).json({ details, total });
    }

    @Post('/add')
    async create(@Body() moviePayload: CreateMovieDTO): Promise<any> {
        const movie = await this.movieService.add(moviePayload);
        return movie;
    }



    @Put('/watched')
    async watched(@Body() moviePayload: MoviesDTO, @Res() res: Response): Promise<any> {
        const movie = await this.movieService.watched(moviePayload);

        res.status(HttpStatus.OK).json({ movie });

    }

    @Post('/watching')
    async watching(@Body() movie: any, @Res() res: Response): Promise<any> {
        this.hook.setUsername('Movie Watcher');
        const embed = new MessageBuilder() // Mine
            .setTitle(`We are Currently watching : ${movie.title}`)
            .setURL(movie.url)
            .setColor('#00b0f4')
            .setDescription(`${movie.overview} -<@&841089593956892683>`)
            .setImage(movie.poster)
            .setTimestamp();

        const embedTwo = new MessageBuilder() // Qs
            .setTitle(`We are Currently watching : ${movie.title}`)
            .setURL(movie.url)
            .setColor('#00b0f4')
            .setDescription(`${movie.overview} -<@&870739297832157184>`)
            .setImage(movie.poster)
            .setTimestamp();

        try {
            Promise.all([this.hook.send(embed), this.secoond_Hook.send(embedTwo)]);
            res.status(HttpStatus.ACCEPTED).json({ message: 'Web Hook Sent' });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    /* Actors */
    @Get('/actors/:id')
    async index(@Param('id') id: number, @Res() res: Response): Promise<any> {

        const response = await this.http.get(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`).toPromise();
        const movies = await this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=${id}&with_watch_monetization_types=flatrate`).toPromise();

        const actor = { ...response.data, movies: movies.data.results };

        res.status(HttpStatus.OK).json(actor);
    }
}
