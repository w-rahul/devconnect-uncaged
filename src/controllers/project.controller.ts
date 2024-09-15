import { Response, Request } from "express";
import z from 'zod'
import { prisma } from "../app";

const createProjectSchema = z.object({
    name: z.string().min(3).max(100),
    description: z.string().max(500),
    techStack: z.array(z.string()).min(1).max(10)

})

export const createProject = async (req: Request, res: Response)=>{
    const body = req.body
    const success = createProjectSchema.safeParse(body)
    const UserID = req.userId

    if(!success.success){
        return res.status(400).json({message : "Invalid inputs"})
    }

    const ProjectExists = await prisma.project.findUnique({
        where:{
            name : body.name
        }
    })

    if(ProjectExists){
        return res.status(400).json({message : "Project name already taken"})
    }

    const NewProject = await prisma.project.create({
        data:{
            name : body.name,
            description : body.description,
            techStack : body.techStack,
            creatorID : UserID || "",
        }
    })

    return res.status(200).json({
        messge : "Project created",
        NewProject
    })

}

export  const AllProject = async  (req: Request, res: Response)=>{
 
    try {
        const projects = await prisma.project.findMany();

        return res.status(200).json({
             projects
         })
    } 
    catch (error) {
        return res.status(500).json({ message: "Error fetching projects" });
    }
}

export  const ProjectbyID = async (req: Request, res: Response)=>{

    const { id } = req.params
    if (!id) return res.status(400).json({
         message: "Project ID is required"
     })

    try {
        const project = await prisma.project.findUnique({
             where: {
                 id
             }
         })
        if (!project) return res.status(404).json({
             message: "Project not found" 
        })

        return res.status(200).json({
             project
        })
    } 
    catch (error) {
        return res.status(500).json({ message: "Error fetching project" });
    }

}


const updateProjectSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    techStack: z.array(z.string()).optional(),
})


export  const UpdateProjectbyID = async (req: Request, res: Response)=>{

    const { id } = req.params;
    const body = req.body;

    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
    }

    try {

        const projectExists = await prisma.project.findUnique({
             where: {
                 id
            }
         })
        if (!projectExists) {
            return res.status(404).json({ message: "Project not found" });
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: body,
        })

        return res.status(200).json({ project: updatedProject })

    } catch (error) {

        return res.status(500).json({ message: "Internal server error" });
    }
}

export  const DeleteProjectbyID =async (req: Request, res: Response)=>{

    const { id } = req.params;

    try {

        const projectExists = await prisma.project.findUnique({
             where: {
                 id 
            } 
        })
        if (!projectExists) {
            return res.status(404).json({ message: "Project not found" });
        }

        await prisma.project.delete({
             where: {
                 id
            }
        })

        return res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {

        return res.status(500).json({ message: "Internal server error" });
    }
}