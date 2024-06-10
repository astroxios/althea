import { body, ValidationChain } from 'express-validator';

export const registerValidationRules = (): ValidationChain[] => {
    return [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('username')
            .isString()
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be between 3 and 20 characters long'),
        body('password')
            .isString()
            .isLength({ min: 8, max: 64 })
            .withMessage('Password must be between 8 and 64 characters long'),
    ];
};

export const patchValidationRules = (): ValidationChain[] => {
    return [
        body('email').optional()
            .isEmail()
            .withMessage('Email must be valid'),
        body('username').optional()
            .isString()
            .isLength({ min:3, max: 20 })
            .withMessage('Username must be between 3 and 20 characters long'),
        body('password').optional()
            .isString()
            .isLength({ min: 8, max: 65 })
            .withMessage('Password must be between 8 and 64 characters long'),
    ];
};
