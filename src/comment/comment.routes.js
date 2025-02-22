import { Router } from 'express'

import { 
    addComment, 
    updateComment, 
    deleteComment,
    getComments,
    getAllComments
} from "./comment.controller.js"
import { validateJwt} from '../../middlewares/validate.jwt.js'
import { addCommentValidator, updateCommentValidator } from '../../helpers/validator.js'

const api = Router()

api.post(
    "/comments", 
    [
        validateJwt, 
        addCommentValidator
    ], 
    addComment
)
api.put(
    "/:id",
    [
        validateJwt, 
        updateCommentValidator
    ], 
    updateComment
)
api.delete(
    "/:id",
    [validateJwt], 
    deleteComment
)
api.get(
    "/getComment",
    [validateJwt], 
    getComments
)

api.get(
    "/getAll",
    [validateJwt], 
    getAllComments
)

export default api
