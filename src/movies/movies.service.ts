import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, catchError } from 'rxjs/operators';

import { Movies } from './movies.entity';
import { CreateMovieDTO, MoviesDTO } from './movies.dto';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movies)
        private movieRepository: Repository<Movies>
    ) { }

    async findAllCount(watched: number): Promise<any> {
        let [movies, count] = await this.movieRepository.findAndCount({
            where: { watched: watched }
        });

        return count;
    }

    async findAllByPage(watched: number, page: number): Promise<Movies[]> {
        return await this.movieRepository.find({
            where: {
                watched: watched
            },
            take: 16,
            skip: (page - 1) * 16
        });
    }


    async findAllByUnWatched(): Promise<Movies[]> {
        return await this.movieRepository.find({
            where: {
                watched: 0
            },
        });
    }

    async findById(movie_id: number): Promise<Movies> {
        return this.movieRepository.findOne({
            where: { movie_id },
        });
    }

    async add(movie: CreateMovieDTO): Promise<Movies> {
        const { movie_id } = movie;
        const movies = await this.movieRepository.findOne({
            where: { movie_id },
        });

        if (movies) {
            throw new HttpException('Movie already added', HttpStatus.FOUND);
        }

        return await this.movieRepository.save({ ...movie });
    }

    async remove(id: number): Promise<void> {
        await this.movieRepository.delete(id);
    }

    async watched(movie: MoviesDTO): Promise<Movies> {
        return await this.movieRepository.save({ ...movie, id: Number(movie.id), watched_on: new Date() });
    }
}
