import { Router } from 'express'
import { 
    updateUser,
    updatePassword,
} from './user.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'
/*import { updateUserValidator, updatePasswordValidator } from '../../helpers/validator.js'*/

const api = Router()

api.put(
    '/password', 
    [validateJwt],
    updatePassword
)

api.put(
    '/MyProfile',
    [validateJwt],
    updateUser
)

export default api