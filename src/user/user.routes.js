import { Router } from 'express'
import { 
    updateUser,
    updatePassword,
    getOne,
    getAllUsers,
} from './user.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'
import { updateUserValidator, updatePasswordValidator } from '../../helpers/validator.js'

const api = Router()

api.put(
    '/password', 
    [
        validateJwt, 
        updatePasswordValidator
    ],
    updatePassword
)

api.put(
    '/MyProfile',
    [
        validateJwt, 
        updateUserValidator
    ],
    updateUser
)

api.get(
    '/myProfile',
    [validateJwt],
    getOne
)

api.get(
    '/AllUsers',
    [validateJwt, isAdmin],
    getAllUsers
)
export default api