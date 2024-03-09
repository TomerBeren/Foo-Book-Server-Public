import userController from '../controllers/userController.js'
import authController from '../controllers/authController.js'
import express from 'express'

const router = express.Router();

router.post('/', userController.createUser)
router.get('/check-username', userController.checkUsernameAvailability)
router.get('/:id', authController.isLoggedIn, userController.getUserDetailes)
router.patch('/:id', authController.isLoggedIn, userController.editUserDetails)
router.delete('/:id', authController.isLoggedIn, userController.deleteUser)

export default router