import userController from '../controllers/User.js'
import authController from '../controllers/authController.js'
import postController from '../controllers/PostController.js'
import express from 'express'

const router = express.Router();

router.post('/', userController.createUser)
router.get('/:id', authController.isLoggedIn, userController.getUserDetailes)

router.get('/:id/posts', authController.isLoggedIn, postController.getPostsByUserId);
router.post('/:id/posts',authController.isLoggedIn, postController.createPostForUser);

export default router