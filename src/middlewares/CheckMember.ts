import {Request, Response, NextFunction } from 'express' 
import { prisma } from '../app'

export const CheckMember = async (req: Request, res: Response, next: NextFunction) => {
   
    try {
        const { projectID, userID } = req.params
    
        const isMember = await prisma.user.findFirst({
            where: {
              id: userID,
              projectMembers: {
                some: {
                  id: projectID,
                },
              },
            },
          })
      
          const isCreator = await prisma.project.findFirst({
            where: {
              id: projectID,
              creatorID: userID,
            },
          })
    
          if(isMember || isCreator){
            next()
          }
          else {
            return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
          }    
    } 
    catch (error){
        return res.status(500).json({ message: 'Server error', error });
    }
    
}
