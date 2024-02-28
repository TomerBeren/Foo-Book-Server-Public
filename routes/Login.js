import express from 'express'
import loginController from '../controllers/Login.js'
const router = express.Router();

router.post('/', loginController.login)

export default router;