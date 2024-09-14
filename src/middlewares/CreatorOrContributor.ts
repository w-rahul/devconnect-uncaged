import { Request, Response, NextFunction } from "express";
import { prisma } from "../app";

export const CheckCreatorOrContributor = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.ProjectId;
  const userId = req.params.UserId || req.userId

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      creator: true,
      members: {
        include: {
          user: true
        }
      }
    }
  })

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const isCreator = project.creatorID === userId;
  const isMember = project.members.some(member => member.userID === userId)

  if (req.method === 'POST') {
    if (isCreator || isMember) {
      return next()
    }
  } else if (req.method === 'PUT' || req.method === 'DELETE') {
    if (isCreator) {
      return next()
    }
  }

  return res.status(403).json({ message: 'Forbidden' });

}