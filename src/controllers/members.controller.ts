import { Response, Request } from "express";
import { prisma } from "../app";

export const AddMember = async (req: Request, res: Response) =>{

    const projectID = req.params.projectID
    const userID = req.body.userID

    try {
        const project = await prisma.project.findUnique({
            where: {
                 id: projectID 
            }
        })

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        const existingMember = await prisma.projectMember.findFirst({
            where: {
                projectID: projectID,
                userID: userID
            }
        })

        if (existingMember) {
            return res.status(400).json({ message: "User is already a member" })
        }

        const newMember = await prisma.projectMember.create({
            data: {
                projectID: projectID,
                userID: userID,
                role: 'VIEWER'
            }
        })

        return res.status(201).json({
            message: "Member added successfully",
            newMember
        })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const RemoveMember = async (req: Request, res: Response) =>{

    const projectID = req.params.projectID;
    const userID = req.params.userID;

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectID }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const member = await prisma.projectMember.findFirst({
            where: {
                projectID: projectID,
                userID: userID
            }
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        await prisma.projectMember.delete({
            where: {
                id: member.id 
            }
        });

        return res.status(200).json({ message: "Member removed successfully" });
    } 
    catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
