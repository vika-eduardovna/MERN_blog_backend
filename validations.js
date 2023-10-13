import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Not correct format').isEmail(),
    body('password', 'Password should consists minimum 5 symbols').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Not correct format').isEmail(),
    body('password', 'Password should consists minimum 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Apply your name please').isLength({ min: 3 }),
    body('avatarUrl', 'Not correct format').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter an article title').isLength({ min: 3 }).isString(),
    body('text', 'Enter the text').isLength({ min: 10 }).isString(),
    body('tags', 'Uncorrect tags format').optional().isString(),
    body('imageUrl', 'Uncorrect link format').optional().isString(),
];