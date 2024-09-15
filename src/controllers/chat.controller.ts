import { Request, Response } from "express";
import { prisma } from "../app";

export const CreateChat = async (req: Request, res: Response) =>{
    const {projectID, userID} = req.params
    const message  = req.body.message

    try {

        const chat = await prisma.chat.create({
            data:{
                projectID : projectID,
                userID : userID,
                message : message
            }
        })

        req.app.get('socketio').to(projectID).emit('receiveMessage', {message, userID})
        
        return res.status(200).json(chat)

    } catch (error) {
       
        console.log(error)
        return res.status(500).json({
            message : "Error creating chat message"
        })
    }

}

export const GetChat = async (req: Request, res: Response) =>{

    const { projectID} = req.params
    
    try {
        
        const AllChats = await prisma.chat.findMany({
            where:{
                projectID : projectID
            },
            orderBy:{
                createdAt : 'asc'
            }
        })

        return res.status(200).json(AllChats)

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message : "Error getting chat"
        })
    }
}