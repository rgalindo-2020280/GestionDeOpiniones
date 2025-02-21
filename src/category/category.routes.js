import { Router } from 'express'
import { 
    addCategory,
    deleteCategory,
    updateCategory
} from './category.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'

const api = Router()
api.post(
    '/addCategory',
    [validateJwt, isAdmin],
    addCategory
)

api.put(
    '/:id',
    [validateJwt, isAdmin],
    updateCategory
)

api.delete(
    '/:id',
    [validateJwt, isAdmin],
    deleteCategory
)

export default api