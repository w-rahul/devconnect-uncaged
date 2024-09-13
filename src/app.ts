import express from 'express'
import { auth } from './routes/auth'
import { projects } from './routes/projects'
import { code } from './routes/code'
import { chat } from './routes/chat'

const app = express()
const PORT = 8080

app.use(express.json())

app.use('/api/auth', auth )
app.use('/api/projects', projects )
app.use('/api/code', code )
app.use('/api/chat', chat )

app.listen(PORT , ()=>{
    console.log(`The server is listening on ${PORT}`)
})