import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class ActorsService {
    constructor(
        private http: HttpService
    ) { }
}
