import { NextFunction, Request, Response } from 'express';
import { NotAuthenticatedError } from '../errors/NotAuthenticatedError';
import { v4 } from 'uuid';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { NestedError } from 'ts-nested-error';
import { isDevelopmentMode } from '../config/environment';
import { ErrorResponse } from '../api-clients/backend-openapi-v1';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';
import { BadRequest } from 'express-openapi-validator/dist/framework/types';
import mongoose from 'mongoose';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.log('ErrorMiddleware: ', error);

  if (isDevelopmentMode()) console.log(`Handling error for a ${req.xhr ? 'n async' : 'normal'} request to ${req.url}`);

  const errorResponse: ErrorResponse = {
    id: v4(),
    type: 'Error',
    message: error.message,
  };

  let status = 500;

  if (error instanceof NotFoundError) {
    status = 404;
    errorResponse.id = error.id;
    errorResponse.type = NotFoundError.type;
  } else if (error instanceof NotAuthenticatedError) {
    status = 401;
    errorResponse.id = error.id;
    errorResponse.type = NotAuthenticatedError.type;
  } else if (error instanceof NotAuthorizedError) {
    status = 403;
    errorResponse.id = error.id;
    errorResponse.type = NotAuthorizedError.type;
  } else if (error instanceof BadRequestError) {
    status = 400;
    errorResponse.id = error.id;
    errorResponse.type = BadRequestError.type;
  } else if (error instanceof BadRequest) {
    status = 400;
    errorResponse.id = v4();
    errorResponse.type = BadRequestError.type;
  } else if (error instanceof mongoose.mongo.MongoServerError) {
    const decoded = decodeMongoErrors(error);
    status = decoded.status;
    errorResponse.id = v4();
    errorResponse.type = decoded.type;
    errorResponse.message = decoded.message;
  }

  if (error instanceof NestedError) {
    errorResponse.caused_by = error.innerErrors?.map((e) => ({
      message: e.message,
      name: e.name,
      stack: isDevelopmentMode() ? e.stack : undefined,
    }));
  }

  if (isDevelopmentMode()) {
    errorResponse.stack = error.stack;

    console.log(`sending ${JSON.stringify(errorResponse)} with status code ${status}`);
  }
  res.status(status).send(errorResponse);
}

function decodeMongoErrors(error: mongoose.mongo.MongoServerError): { status: number; type: string; message: string } {
  let status = 500,
    type = 'Server error',
    message = '';

  // duplicate key
  if (error.code === 11000) {
    status = 400;
    type = BadRequestError.type;
    message = `Duplicate key error at: ${JSON.stringify(error.keyValue)}`;
  }

  return {
    status,
    type,
    message,
  };
}
