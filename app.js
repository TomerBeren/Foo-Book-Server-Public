import express from 'express'
import bodyParser from 'body-parser'
import postRouter from './routes/postRoutes.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import mongoose from 'mongoose'
import customEnv from 'custom-env'
import cors from 'cors';

customEnv.env(process.env.NODE_ENV, './config')
console.log(`Environment: ${process.env.NODE_ENV}`);
mongoose.connect(process.env.CONNECTION_STRING).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
const server = express()
console.log('Server initialized.');
server.use(cors());
server.use(express.static('public'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.json());


server.use('/api/users', userRouter)
server.use('/posts', postRouter)
server.use('/api/tokens', authRouter)

server.listen(process.env.PORT)