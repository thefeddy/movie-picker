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
        nullable: true,
    })
    watched: number;

    @Column({
        name: 'watched_with',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    watched_with: string;

    @Column({
        name: 'watched_on',
        type: 'timestamptz',
        nullable: true,
    })
    watched_on: Date;

    @Column({
        name: 'added',
        type: 'timestamptz',
        nullable: true,
    })
    added: Date;

    toResponseObject(): MoviesRO {
        const { id, movie_id, watched, watched_on, added, watched_with } = this;

        const responseObject: MoviesRO = {
            id,
            movie_id,
            watched,
            watched_on,
            added,
            watched_with
        };

        return responseObject;
    }
}
