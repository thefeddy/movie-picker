import { Body, Controller, Get, HttpStatus, Post, Render, Res, Param, Patch, Put, HttpService } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { ActorsService } from './actors.service';
@ApiTags('Actors') @Controller('')
@Controller('')
export class ActorsController {
    constructor(private actorsService: ActorsService, private http: HttpService) { }



}
