import { Router } from 'express';
import { login, register } from './auth.controller';
import { loginValidator, registerValidator } from './auth.validators';
import { validateRequest } from '../../middlewares/validation.middleware';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);

export default router;

