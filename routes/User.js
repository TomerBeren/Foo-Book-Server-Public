import userController from '../controllers/User.js'
import express from 'express'

const router = express.Router();

router.post('/', userController.createUser)

export default router