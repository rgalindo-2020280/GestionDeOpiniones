import { Router } from 'express'
import { 
    updateUser,
    updatePassword,
} from './user.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'
import { updateUserValidator, updatePasswordValidator } from '../../helpers/validator.js'

const api = Router()

api.put(
    '/password', 
    [validateJwt, updatePasswordValidator],
    updatePassword
)

api.put(
    '/MyProfile',
    [validateJwt, updateUserValidator],
    updateUser
)

export default api