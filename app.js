import express from 'express'
import bodyParser from 'body-parser'
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

server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
server.use(express.json({limit: '50mb'}));


server.use('/api/users', userRouter)
server.use('/api/tokens', authRouter)

server.listen(process.env.PORT)