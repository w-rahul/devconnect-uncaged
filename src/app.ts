import express from 'express'
import { auth } from './routes/auth'
import { projects } from './routes/projects'
import { code } from './routes/code'
import { chat } from './routes/chat'
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv"
import cloudinary from 'cloudinary';

dotenv.config()

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const PORT = 8080
export const prisma = new PrismaClient()

app.use(express.json())

app.use('/api/auth', auth )
app.use('/api/projects', projects )
app.use('/api/code', code )
app.use('/api/chat', chat )

app.listen(PORT , ()=>{
    console.log(`The server is listening on ${PORT}`)
})