import { Router } from "express"
import {
    addPost,
    updatePost,
    deletePost,
    getAllPosts,
    getUserPosts
} from "./post.controller.js"
import { validateJwt} from '../../middlewares/validate.jwt.js'
import { addPostValidator, updatePostValidator } from '../../helpers/validator.js'

const api = Router()

api.post(
    '/addPost',
    [
        validateJwt, 
        addPostValidator
    ],
    addPost
)

api.put(
    '/:id',
    [
        validateJwt, 
        updatePostValidator
    ],
    updatePost
)

api.delete(
    '/:id',
    [validateJwt],
    deletePost
)
api.get(
    '/getAllPost',
    [validateJwt],
    getAllPosts
)

api.get(
    '/getMyPost',
    [validateJwt],
    getUserPosts
)


export default api