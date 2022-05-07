import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

import * as exphbs from 'express-handlebars';
import * as moment from 'moment';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './filters/http-exception.filter';
import { env } from 'process';

const PUBLIC_PATH = join(__dirname, '..', 'public');
const VIEWS_PATH = join(__dirname, '..', 'src/views');

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(PUBLIC_PATH);
    app.setBaseViewsDir(VIEWS_PATH);

    const blocks = {};
    const helpers = {
        extend: function (name, context) {
            var block = blocks[name];
            if (!block) {
                block = blocks[name] = [];
            }

            block.push(context.fn(this));
        },
        block: function (name) {
            var val = (blocks[name] || []).join('\n');

            // clear the block
            blocks[name] = [];
            return val;
        },
        pagination: (n, block) => {
            let page = '';
            for (let i = 0; i < n; i += 1)
                page += block.fn(i + 1);
            return page;
        },
        equals: (v1, v2, options) => {
            if (v1.length === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        moment: (date: string, format: string) => {
            return moment(date).format(format);
        }

    };

    const hbs = exphbs.create({
        defaultLayout: 'base',
        layoutsDir: VIEWS_PATH,
        partialsDir: join(__dirname, '..', 'views', 'partials'),
        helpers,
        extname: '.hbs',
    });

    app.engine('hbs', hbs.engine);
    app.setViewEngine('hbs');

    app.use((req, res, next) => {
        res.set('X-Powered-By', 'Lots and Lots of Coffee');
        next();
    });

    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors({
        origin: ['http://localhost:3000'],
        credentials: true,
    });
    const config = new DocumentBuilder()
        .setTitle('Sperg Theatre')
        .setDescription('Sperg Theatre API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(env.PORT);
}
bootstrap();
