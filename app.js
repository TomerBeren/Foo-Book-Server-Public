import express from 'express'
import bodyParser from 'body-parser'
import routerPosts from './routes/Posts.js'
import routerLogin from './routes/Login.js'
import routerUser from './routes/User.js'
import session from 'express-session'
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
server.use(session({
    secret: 'foo',
    saveUninitialized: false,
    resave: false
}))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.json());

server.use('/register', routerUser)
server.use('/posts', routerPosts)
server.use('/login', routerLogin)

server.listen(process.env.PORT)