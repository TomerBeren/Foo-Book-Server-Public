import express from 'express';
import postController from '../controllers/PostController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/', authController.isLoggedIn, postController.getFeedPosts)
router.get('/:id/posts', authController.isLoggedIn, postController.getPostsByUserId);
router.post('/:id/posts', authController.isLoggedIn, postController.createPostForUser);
router.patch('/:id/posts/:pid', authController.isLoggedIn, postController.updatePostForUser);
router.delete('/:id/posts/:pid', authController.isLoggedIn, postController.deletePostForUser);
router.patch('/:id/posts/:pid/like', authController.isLoggedIn, postController.toggleLike);

export default router;
