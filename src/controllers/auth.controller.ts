import { Request, Response } from "express"

export const signup = (req : Request , res : Response)=>{
    return res.status(200).json({
        message : "Hello from signup"
    })
}

export const login = (req : Request , res : Response)=>{
    return res.status(200).json({
        message : "Hello from login"
    })
}

export const me = (req : Request , res : Response)=>{
    return res.status(200).json({
        message : "Hello /me"
    })
}
