import express from 'express'
import authController from '../controllers/authController.js'
import PostController from '../controllers/PostController.js';
const router = express.Router();

router.get('/', authController.isLoggedIn, PostController.getFeedPosts)

export default router;