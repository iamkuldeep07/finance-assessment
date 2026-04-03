import { body, query } from 'express-validator';

export const createRecordValidator = [
  body('amount')
    .toFloat() 
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),

  body('type')
    .trim()
    .isIn(['income', 'expense']).withMessage('Type must be either income or expense'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .escape(),

  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)')
    .toDate(), 
];

export const filterValidator = [
  query('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Invalid type filter'),
  
  query('category')
    .optional()
    .trim()
    .escape(),

  query('from')
    .optional()
    .isISO8601().withMessage('Invalid from date')
    .toDate(),

  query('to')
    .optional()
    .isISO8601().withMessage('Invalid to date')
    .toDate(),

  query('page')
    .optional()
    .toInt() 
    .isInt({ min: 1 }).withMessage('Page must be at least 1'),

  query('limit')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const updateRecordValidator = [
  body('amount')
    .optional({ checkFalsy: true })
    .toFloat()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than zero'),

  body('type')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters')
    .escape(),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .escape(),

  body('date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format (use YYYY-MM-DD)')
    .toDate(),
];