import {Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string

export const Authenticate = async (req: Request, res:Response, next: NextFunction ) => {
    const token = req.headers.authorization?.split(" ")[1]
    
    if(!token){
        return res.status(401).json({message : "Acess Denied : No token found"})
    }

    try{
        const decoded = verify(token, JWT_SECRET) as {id:string, role:string}

        req.userId = decoded.id
        req.userRole = decoded.role
        next()
    } catch (error) {
            return res.status(400).json({ message: "Invalid token." })
    }
}