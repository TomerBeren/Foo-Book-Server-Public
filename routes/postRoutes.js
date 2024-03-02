import express from 'express'
import postController from '../controllers/Posts.js'
import loginController from '../controllers/authController.js'
const router = express.Router();

router.get('/', loginController.isLoggedIn, postController.getPosts)
router.get('/:id', loginController.isLoggedIn, postController.getPost)

export default router;