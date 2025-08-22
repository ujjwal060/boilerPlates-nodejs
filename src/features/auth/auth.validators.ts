import { body } from 'express-validator';

export const registerValidator = [
  body('username').isString().isLength({ min: 3, max: 50 }),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
];

