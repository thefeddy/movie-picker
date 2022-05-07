import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RouterModule, Routes } from 'nest-router';


/* Modules */
import { MoviesModule } from './movies/movies.module';
import { ActorsModule } from './actors/actors.module';

import { UsersModule } from './users/users.module';

/* Entities */
import { Movies } from './movies/movies.entity';
import { Users } from './users/users.entity';
import { APIModule } from './api/api.module';

/* Services */


const routes: Routes = [
    {
        path: '/',
        module: MoviesModule,
    },
    {
        path: '/actor',
        module: ActorsModule,
    },
    {
        path: '/api',
        module: APIModule,
    },
];


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: process.env.TYPEORM_HOST,
                port: Number(process.env.TYPEORM_PORT),
                username: process.env.TYPEORM_USERNAME,
                password: process.env.TYPEORM_PASSWORD,
                database: process.env.TYPEORM_DATABASE,
                entities: [Movies, Users],
                synchronize: true,
            }),
        }),
        RouterModule.forRoutes(routes),
        MoviesModule,
        ActorsModule,
        UsersModule,
        APIModule

    ],
    controllers: [],
    providers: [],
})

export class AppModule { }
