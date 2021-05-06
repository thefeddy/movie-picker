import { Module, HttpModule } from '@nestjs/common';

import { ActorsController } from './actors.controller';
import { ActorsService } from './actors.service';

@Module({
    imports: [HttpModule],
    providers: [ActorsService],
    controllers: [ActorsController],
})

export class ActorsModule { }
