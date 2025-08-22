import jwt from 'jsonwebtoken';
import config from '../../config';
import { HTTP_STATUS } from '../../utils/constants';
import logger from '../../utils/logger';
import { createUser, findUserByEmail, toSafeUser, verifyUserPassword } from '../users/user.service';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    const error: any = new Error('Email already in use');
    error.statusCode = HTTP_STATUS.CONFLICT;
    throw error;
  }

  const user = await createUser(input);
  logger.info(`User registered: ${user.email}`);
  const safe = toSafeUser(user);
  const token = generateJwtToken({ id: safe._id, role: safe.role || 'user' });
  return { user: safe, token };
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    const error: any = new Error('Invalid email or password');
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  const isValid = await verifyUserPassword(user, input.password);
  if (!isValid) {
    const error: any = new Error('Invalid email or password');
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  const safe = toSafeUser(user);
  const token = generateJwtToken({ id: safe._id, role: safe.role || 'user' });
  logger.info(`User logged in: ${user.email}`);
  return { user: safe, token };
}

export function generateJwtToken(payload: { id: string; role: string }): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

