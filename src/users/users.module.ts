import { Module, HttpModule } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [HttpModule],
    providers: [UsersService],
    controllers: [UsersController],
})

export class UsersModule { }
