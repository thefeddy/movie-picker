import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import * as session from 'express-session';

import { AppModule } from './app.module';

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

    app.use(
        session({
            secret: 'LlbfMTe#Sf*L6',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 36000 }
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());


    app.use((req, res, next) => {
        res.set('X-Powered-By', 'Lots and Lots of Coffee');
        next();
    });

    await app.listen(3002);
}
bootstrap();
