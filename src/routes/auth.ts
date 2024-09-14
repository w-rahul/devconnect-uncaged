import express from 'express'
import { login, me, signup } from '../controllers/auth.controller'
import { Authenticate } from '../middlewares/Auth'

export const auth = express.Router()

auth.post('/signup', signup )

auth.post('/login', login)

auth.get('/me', Authenticate, me)
