import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger'; 
import { HTTP_STATUS } from '../utils/constants';

interface CustomError extends Error {
  statusCode?: number;
  data?: any;
}

export const errorHandler = (
  err: CustomError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  logger.error(`Error: ${statusCode} - ${message}`, {
    method: req.method,
    url: req.url,
    body: req.body,
    errorStack: err.stack,
    errorData: err.data
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    data: err.data 
  });
};
