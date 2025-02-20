import { Router } from "express"
import {
    addPost,
    updatePost,
    deletePost
} from "./post.controller.js"
import { validateJwt} from '../../middlewares/validate.jwt.js'

const api = Router()

api.post(
    '/addPost',
    [validateJwt],
    addPost
)

api.put(
    '/:id',
    [validateJwt],
    updatePost
)

api.delete(
    '/:id',
    [validateJwt],
    deletePost
)

export default api