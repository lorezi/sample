import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors'

import cookieParser from 'cookie-parser';
import compression from 'compression';


import courseRouter from './routes/courseRoutes';
import authRouter from './routes/authRoutes';
import moniepointRouter from './routes/moniepointRoutes';

import globalErrorHandler from './controllers/errorController';
import AppError from './utils/appError';

const app = express();

const api = '/api/v1';

// Global middleware

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from a particular IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1hr ==> min * sec * 10^3
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());




// Enable compression
app.use(compression());

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

// Mounting the router as a middleware
app.use(`${api}/`, authRouter);
app.use(`${api}/courses`, courseRouter);
// route registry
app.use(`${api}/transactions`, moniepointRouter);

// Catch all unhandled routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
