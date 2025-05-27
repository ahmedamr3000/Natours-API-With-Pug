import express from 'express';
import mongoose from 'mongoose';
import { bootstrap } from './app.controller.js';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on('uncaughtException', (err) => {
  // any promise error
  // console.log(err.name, err.message);
  process.exit(1);
});
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    // console.log('mongo is conected');
  })
  .catch((err) => console.log('dataBase Error'));

const app = express();
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//                         security middleware
//body data limit
app.use(express.json({ limit: '10kb' }));
//data sanitization against no sql query inquestion
app.use(ExpressMongoSanitize());

//data sanitization against xxs  (dont allaw html code)

app.use(xss());

//http headers

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://js.stripe.com'],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        connectSrc: ["'self'", 'https://api.stripe.com', 'ws://localhost:*'],
        imgSrc: ["'self'", 'data:', 'https://*.stripe.com'],
      },
    },
  })
);

app.use(cookieParser());
// handel sending 2 same filtration (sort)
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//limit of requests  from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request try agin in hour! ',
});
app.use(limiter);

app.use(cors());
app.use(
  cors({
    origin: '',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

//             end of security middleware

// compression
app.use(compression());

bootstrap(app, express);

const port = process.env.PORT || 4200;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
process.on('unhandledRejection', (err) => {
  // any promise error
  server.close(() => {
    process.exit(1);
  });
});
