import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RouterModule, Routes } from 'nest-router';


/* Modules */
import { MoviesModule } from './movies/movies.module';
import { ActorsModule } from './actors/actors.module';

/* Entities */
import { Movies } from './movies/movies.entity';

const routes: Routes = [
    {
        path: '/',
        module: MoviesModule,
    },
    {
        path: '/actors',
        module: ActorsModule,
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
                entities: [Movies],
                synchronize: true,
            }),
        }),
        RouterModule.forRoutes(routes),
        MoviesModule,
        ActorsModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule { }
