import userController from '../controllers/userController.js'
import authController from '../controllers/authController.js'
import postController from '../controllers/PostController.js'
import express from 'express'

const router = express.Router();

router.post('/', userController.createUser)
router.get('/check-username', userController.checkUsernameAvailability)
router.get('/:id', authController.isLoggedIn, userController.getUserDetailes)


router.get('/:id/posts', authController.isLoggedIn, postController.getPostsByUserId);
router.post('/:id/posts', authController.isLoggedIn, postController.createPostForUser);
router.patch('/:id/posts/:pid', authController.isLoggedIn, postController.updatePostForUser);
router.delete('/:id/posts/:pid', authController.isLoggedIn, postController.deletePostForUser); 

export default router