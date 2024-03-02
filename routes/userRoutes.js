import userController from '../controllers/User.js'
import authController from '../controllers/authController.js'

import express from 'express'

const router = express.Router();

router.post('/', userController.createUser)
router.get('/:id', authController.isLoggedIn, userController.getUserDetailes)

export default router