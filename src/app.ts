import express from 'express'
import { auth } from './routes/auth'
import { projects } from './routes/projects'
import { code } from './routes/code'
import { chat } from './routes/chat'
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv"
import cloudinary from 'cloudinary';
import { Server, Socket } from 'socket.io'

dotenv.config()

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const PORT = process.env.PORT
export const prisma = new PrismaClient()

const io = new Server({
  cors:{
    origin : "*"
  }
})

app.use(express.json())

app.use('/api/auth', auth )
app.use('/api/projects', projects )
app.use('/api/code', code )
app.use('/api/chat', chat )

io.on('connection', (Socket)=>{
  console.log('A user is connected')

  Socket.on('joinProject', (projectID) =>{
      Socket.join(projectID)
  })

  Socket.on('sendMessage', (data)=>{
      const {projectID, message, userID } = data
      io.to(projectID).emit('receviceMessage', {userID, message})
  })

  Socket.on('dissconnect', ()=>{
    console.log('User disconnected')
  })

})

const server = app.listen(PORT , ()=>{
    console.log(`The server is listening on ${PORT}`)
})

io.listen(server)