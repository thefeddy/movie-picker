import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Unique,
    Index,
} from 'typeorm';

import { MoviesRO } from './movies.ro';

@Entity()
export class Movies {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'movie_id',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    movie_id: string;

    @Column({
        name: 'watched',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    watched: number;

    toResponseObject(): MoviesRO {
        const { id, movie_id, watched } = this;

        const responseObject: MoviesRO = {
            id,
            movie_id,
            watched
        };

        return responseObject;
    }
}
