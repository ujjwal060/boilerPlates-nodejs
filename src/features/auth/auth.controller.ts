import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../utils/constants';
import { loginUser, registerUser } from './auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;
    const result = await registerUser({ username, email, password });
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

