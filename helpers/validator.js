import { body } from "express-validator" 
import { validateErrorWithoutImg } from "./validate.error.js"
import { existUsername, existEmail, objectIdValid } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
        validateErrorWithoutImg
]

export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
        validateErrorWithoutImg
]

export const updateUserValidator = [
    body('name', "Name cannot exceed 30 characters")
    .optional()
    .trim()
    .isLength({ max: 30 }),
    body('surname', "Surname cannot exceed 30 characters")
    .optional()
    .trim()
    .isLength({ max: 30 }),
    body('username', "Username cannot exceed 15 characters")
    .optional()
    .trim()
    .isLength({ max: 15 }),
    body('email', "Invalid email format")
    .optional()
    .trim()
    .isEmail(),
    body('phone', "Phone must be exactly 8 digits")
    .optional()
    .trim()
    .isLength({ min: 8, max: 8 }),
    validateErrorWithoutImg
]

export const updatePasswordValidator = [
    body('newPassword', 'New password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('oldPassword', 'Old password cannot be empty')
        .notEmpty(),
    validateErrorWithoutImg 
]

export const addPostValidator = [
    body('title', "Title is required and cannot exceed 100 characters")
    .notEmpty()
    .trim()
    .isLength({ max: 100 }),
    body('content', "Content is required")
    .notEmpty()
    .trim(),
    body('categoryId', "Category ID is required and must be a valid ObjectId")
    .notEmpty()
    .isMongoId(),
    validateErrorWithoutImg
]

export const updatePostValidator = [
    body('title', "Title cannot exceed 100 characters")
    .optional()
    .trim()
    .isLength({ max: 100 }),
    body('content', "Content cannot be empty")
    .optional()
    .trim(),
    body('categoryId', "Category ID must be a valid ObjectId")
    .optional()
    .isMongoId(),
    validateErrorWithoutImg
]

export const addCategoryValidator = [
    body('name', "Category name is required and cannot exceed 50 characters")
    .notEmpty()
    .isLength({ max: 50 }),
    body('description', "Description cannot exceed 250 characters")
    .optional()
    .isLength({ max: 250 }),
    body('postIds', "Post IDs should be an array of valid ObjectIds")
    .optional()
    .isArray()
    .custom((value) => {
        return value.every(postId => /^[0-9a-fA-F]{24}$/.test(postId))
    }),
    validateErrorWithoutImg
]

export const updateCategoryValidator = [
    body('name', "Category name is required and cannot exceed 50 characters")
    .optional()
    .isLength({ max: 50 }),
    body('description', "Description cannot exceed 250 characters")
    .optional()
    .isLength({ max: 250 }),
    body('postIds', "Post IDs should be an array of valid ObjectIds")
    .optional()
    .isArray()
    .custom((value) => {
        return value.every(postId => /^[0-9a-fA-F]{24}$/.test(postId))
    }),
    validateErrorWithoutImg
]

export const addCommentValidator = [
    body('postId', "Post ID is required and must be a valid ObjectId")
    .notEmpty()
    .isMongoId(),
    body('content', "Content is required and cannot exceed 500 characters")
    .notEmpty()
    .isLength({ max: 500 }),
    validateErrorWithoutImg
]

export const updateCommentValidator = [
    body('content', "Content is required and cannot exceed 500 characters")
    .notEmpty()
    .isLength({ max: 500 }),
    body('postId', "Post ID must be a valid ObjectId")
    .optional()
    .isMongoId(),
    validateErrorWithoutImg
]