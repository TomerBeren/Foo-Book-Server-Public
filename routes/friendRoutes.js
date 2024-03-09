import express from 'express';
import friendController from '../controllers/friendController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/:id/friends', authController.isLoggedIn, friendController.sendFriendRequest);
router.get('/:id/friends', authController.isLoggedIn, friendController.fetchFriendList);
router.get('/:id/friend-requests', authController.isLoggedIn, friendController.fetchFriendRequests);
router.patch('/:id/friends/:fid', authController.isLoggedIn, friendController.acceptFriendRequest);
router.delete('/:id/friends/:fid', authController.isLoggedIn, friendController.deleteFriend);

export default router;
