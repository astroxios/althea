import { body, ValidationChain } from 'express-validator';

export const registerValidationRules = (): ValidationChain[] => {
    return [
        body('data.type')
            .equals('user')
            .withMessage('Type must be "user"'),
        body('data.attributes.email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('data.attributes.username')
            .isString()
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be between 3 and 20 characters long'),
        body('data.attributes.password')
            .isString()
            .isLength({ min: 8, max: 64 })
            .withMessage('Password must be between 8 and 64 characters long'),
    ];
};

export const patchValidationRules = (): ValidationChain[] => {
    return [
        body('data.attributes.email').optional()
            .isEmail()
            .withMessage('Email must be valid'),
        body('data.attributes.username').optional()
            .isString()
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be between 3 and 20 characters long'),
        body('data.attributes.password').optional()
            .isString()
            .isLength({ min: 8, max: 64 })
            .withMessage('Password must be between 8 and 64 characters long'),
    ];
};
