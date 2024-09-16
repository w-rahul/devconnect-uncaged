import { Request, Response, NextFunction } from "express"
import { prisma } from "../app"

export const OwnershipCheck = async (req: Request, res: Response, next : NextFunction) => {
    const userId = req.userId
    const projectId = req.params.projectID

    try{
        const project = await prisma.project.findUnique({ 
            where: {
                id : projectId 
            }
        })

        if(!project){
            return res.status(404).json({message : "Project not found"})
        }

        if(project.creatorID == userId){
            next()
            return
        }

        return res.status(403).json({message : "Forbidden: You are not the owner of this project"})
    }
    catch (error){
        console.log(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

