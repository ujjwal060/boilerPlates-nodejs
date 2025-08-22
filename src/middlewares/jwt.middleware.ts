import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config'; 
import logger from '../utils/logger';
import { HTTP_STATUS } from '../utils/constants';
import { JwtPayload } from '../types/auth.d';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Authentication attempt without token.');
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Authentication attempt with malformed token header.');
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Malformed authentication token' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    logger.debug(`User ${decoded.id} authenticated successfully.`);
    next();
  } catch (err) {
    logger.error('JWT authentication failed:', err);
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user?.id} with role ${req.user?.role}. Required roles: ${roles.join(', ')}.`);
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
