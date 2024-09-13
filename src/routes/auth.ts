import express from 'express'
import { login, me, signup } from '../controllers/auth.controller'

export const auth = express.Router()

auth.post('/signup', signup )

auth.post('/login', login)

auth.get('/me', me)
