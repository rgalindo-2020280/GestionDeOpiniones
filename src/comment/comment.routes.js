import { Router } from 'express'

import { 
    addComment, 
    updateComment, 
    deleteComment 
} from "./comment.controller.js"
import { validateJwt} from '../../middlewares/validate.jwt.js'

const api = Router()

api.post(
    "/comments", 
    [validateJwt], 
    addComment
)
api.put(
    "/:id",
    [validateJwt], 
    updateComment
)
api.delete(
    "/:id",
    [validateJwt], 
    deleteComment
)

export default api
