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
        name: 'title',
        type: 'varchar',
        nullable: true,
        length: 50
    })
    title: string;

    @Column({
        name: 'trailer_url',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    trailer_url: string;

    @Column({
        name: 'streaming_service',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    streaming_service: string;


    @Column({
        name: 'watched',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    watched: number;

    toResponseObject(): MoviesRO {
        const { id, title, trailer_url, streaming_service, watched } = this;

        const responseObject: MoviesRO = {
            id,
            title,
            trailer_url,
            streaming_service,
            watched
        };

        return responseObject;
    }
}
