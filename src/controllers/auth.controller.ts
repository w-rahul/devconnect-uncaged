import { Request, Response } from "express"
import z from 'zod'
import { prisma } from "../app"
import { sign } from "jsonwebtoken"
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET as string

const SignSchema = z.object({
    name : z.string().optional(),
    username : z.string(),
    email : z.string().email(),
    password : z.string().min(6),
    role :  z.enum([ "CREATOR", "CONTRIBUTOR", "VIEWER"]).optional()
})

export const signup =async (req : Request , res : Response)=>{
    const body = req.body
    const success = SignSchema.safeParse(body)
    
    if(!success.success){
        return res.status(400).json({
            message : "Inavlid inputs"
        })
    }

    const UserExists = await prisma.user.findUnique({
       where:{
                 email: body.email
         }
    })

    if(UserExists){
        return res.status(400).json({
            message : "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const NewUser  = await prisma.user.create({
        data:{
            name : body.name,
            username : body.username,
            email : body.email,
            passwordHashed : hashedPassword ,
            role : body.role || "VIEWER"
        }
    })

    const token = sign({id : NewUser.id, role: NewUser.role},JWT_SECRET)

    return res.status(200).json({
        message: "User created successfully",
        NewUser,
        token
    })

}

export const login = async (req : Request , res : Response)=>{
    const { username, password } = req.body

    const User = await prisma.user.findUnique({
        where: { username }
    })

    if (!User) {
        return res.status(404).json({ message: "User not found" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, User.passwordHashed)
    
    if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = sign({ id: User.id, role: User.role }, JWT_SECRET)
    
    return res.status(200).json({
        message: "Login successful",
        token
    })
}

export const me = async (req : Request , res : Response)=>{
    const userId = req.userId

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const User = await prisma.user.findUnique({
        where: { id: userId },
        select:{
            name : true,
            email : true,
            username : true,
            role : true,
        }
    })

    if (!User) {
        return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({
        message: "User details fetched successfully",
        User
    })
}
