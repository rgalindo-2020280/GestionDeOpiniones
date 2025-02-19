import { Router } from 'express'
import { 
    addCategory,
    deleteCategory,
    updateCategory
} from './category.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'

const api = Router()
api.post(
    '/addCategory',
    [validateJwt],
    addCategory
)

api.put(
    '/:id',
    [validateJwt],
    updateCategory
)

api.delete(
    '/:id',
    [validateJwt],
    deleteCategory
)

export default api