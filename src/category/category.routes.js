import { Router } from 'express'
import { 
    addCategory,
    deleteCategory,
    getAllCategories,
    updateCategory
} from './category.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'
import { addCategoryValidator, updateCategoryValidator } from '../../helpers/validator.js'


const api = Router()
api.post(
    '/addCategory',
    [
        validateJwt, 
        isAdmin, 
        addCategoryValidator
    ],
    addCategory
)

api.put(
    '/:id',
    [
        validateJwt, 
        isAdmin, 
        updateCategoryValidator
    ],
    updateCategory
)

api.delete(
    '/:id',
    [
        validateJwt, 
        isAdmin
    ],
    deleteCategory
)

api.get(
    '/getAllCategory',
    [validateJwt],
    getAllCategories
)

export default api