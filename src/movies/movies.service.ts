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
        private movieRepository: Repository<Movies>,
        private http: HttpService
    ) { }

    async findAll(): Promise<Movies[]> {
        return await this.movieRepository.find();
    }

    async findByName(name: string): Promise<Movies> {
        return this.movieRepository.findOne({
            where: { name },
        });
    }

    async add(movie: CreateMovieDTO): Promise<Movies> {
        const { title } = movie;
        const maps = await this.movieRepository.findOne({
            where: { title },
        });

        if (maps) {
            throw new HttpException('Movie already added', HttpStatus.FOUND);
        }

        return await this.movieRepository.save({ ...movie, statusCode: HttpStatus.ACCEPTED });
    }

    async remove(id: number): Promise<void> {
        await this.movieRepository.delete(id);
    }

    async watched(movie: MoviesDTO): Promise<Movies> {
        return await this.movieRepository.save({ ...movie, id: Number(movie.id) });
    }
}
