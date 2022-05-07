import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APIController } from './api.controller';

/* Services */
import { APIService } from './api.service';
import { MovieService } from 'src/movies/movies.service';

/* Entities */
import { Movies } from 'src/movies/movies.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Movies]), HttpModule],
    providers: [APIService, MovieService],
    controllers: [APIController],
})

export class APIModule { }
