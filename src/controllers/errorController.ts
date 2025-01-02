

import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import AppError from '../utils/appError';

// Define interfaces for specific error types
interface CastError extends MongooseError.CastError {
  name: 'CastError';
}

interface ValidationError extends MongooseError.ValidationError {
  name: 'ValidationError';
}

interface MongoError extends MongooseError {
  code?: number;
  keyValue?: Record<string, any>;
}

type ErrorType =
  | CastError
  | ValidationError
  | MongoError
  | JsonWebTokenError
  | TokenExpiredError
  | any;

// Handler for Mongoose CastError
const handleCastErrorDB = (err: CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handler for Mongoose Duplicate Fields Error
const handleDuplicateFieldsDB = (err: MongoError): AppError => {
  const duplicateField = Object.keys(err.keyValue || {})[0];
  const duplicateValue = err.keyValue ? err.keyValue[duplicateField] : '';
  const message = `Duplicate field value: "${duplicateValue}". Please use another value!`;
  return new AppError(message, 400);
};

// Handler for Mongoose ValidationError
const handleValidationErrorDB = (err: ValidationError): AppError => {
  console.log("I'm here....hola")
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handler for JWT Errors
const handleJWTError = (): AppError =>
  new AppError('Invalid token. Please log in again!', 401);

// Handler for JWT Expiration Errors
const handleJWTExpireError = (): AppError =>
  new AppError('Your token has expired! Please log in again.', 401);

// Send detailed error during development
const sendErrorDev = (err: AppError, res: Response, req: Request): void => {
  
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err, 
      message: err.message,
      stack: err.stack,
    });
  } 
};

// Send limited error details during production
const sendErrorProd = (err: AppError, res: Response, req: Request): void => {
  
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      return;
    }

    // Programming or other unknown error: don't leak error details
    // 1. Log error
    console.error('ERROR 🔥🔥🔥', err);

    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  } 
};

// The main error handling middleware
const globalErrorHandler = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default values
  const statusCode = (err.statusCode as number) || 500;
  const status = err.status || 'error';

  // Determine the environment
  const env = process.env.NODE_ENV?.trim();

  if (env === 'development') {
    // In development, send detailed error

    sendErrorDev(new AppError(err.message, statusCode), res, req);
  } else if (env === 'production') {
    // In production, handle specific error types
    let error: AppError;

    if ((err as CastError).name === 'CastError') {
      error = handleCastErrorDB(err as CastError);
    } else if ((err as MongoError).code === 11000) {
      error = handleDuplicateFieldsDB(err as MongoError);
    } else if ((err as ValidationError).name === 'ValidationError') {
      error = handleValidationErrorDB(err as ValidationError);
    } else if ((err as JsonWebTokenError).name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if ((err as TokenExpiredError).name === 'TokenExpiredError') {
      error = handleJWTExpireError();
    } else {
      // If the error is operational, send it; otherwise, send a generic message
      error = err.isOperational
        ? new AppError(err.message, statusCode)
        : new AppError('Something went very wrong!', 500);
    }

    sendErrorProd(error, res, req);
  } else {
    // Default to production-like error handling if NODE_ENV is not set
    sendErrorProd(
      err.isOperational
        ? new AppError(err.message, err.statusCode || 500)
        : new AppError('Something went very wrong!', 500),
      res,
      req
    );
  }
};

export default globalErrorHandler;
