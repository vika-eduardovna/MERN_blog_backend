import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Not correct format').isEmail(),
    body('password', 'Password should consists minimum 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Apply your name please').isLength({ min: 3 }),
    body('avatarUrl', 'Not correct format').optional().isURL(),
];