import e, { Request, Response } from "express"
import cloudinary from 'cloudinary';
import { prisma } from "../app";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

export const PostFile = async (req: Request, res: Response) =>{

    try {
        const ProjectId = req.params.ProjectId
        const UserId = req.params.UserId
        const file = req.file
    
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }
    
        const upload = cloudinary.v2.uploader.upload_stream({
            resource_type : 'auto',
            folder : `projects/${ProjectId}`
        },
            async (error, result) =>{
                if (error) {
                    return res.status(500).json({ message: 'Error uploading file', error });
                  }
    
                  const codesubmission = await prisma.codeSubmission.create({
                    data:{
                        projectID : ProjectId,
                        contributorID : UserId,
                        filePath : result?.secure_url || ""
                    }
                  })
    
                  return res.status(200).json({
                    message : "File upload successfully",
                    file : codesubmission
                  })
            })
    
            file.stream.pipe(upload)
        
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
      }
    
}

export const getFile = async (req: Request, res: Response) =>{
    try {
        const codeSubmissions = await prisma.codeSubmission.findMany({
          where: { projectID: req.query.projectID as string }
        });
    
        return res.status(200).json(codeSubmissions);
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
      }
}

export const getFilebyID = async (req: Request, res: Response) =>{

    try {
        const { submissionId } = req.params;
    
        const codeSubmission = await prisma.codeSubmission.findUnique({
          where: { id: submissionId }
        });
    
        if (!codeSubmission) {
          return res.status(404).json({ message: 'File not found' });
        }
    
        return res.status(200).json(codeSubmission);
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
      }
}

export const UpdateFilebyID = async (req: Request, res: Response) =>{

    try {
        const { submissionId } = req.params;
        const file = req.file;
    
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
    
        const upload = cloudinary.v2.uploader.upload_stream({
          resource_type: 'auto'
        }, async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error uploading file', error });
          }
    
          const updatedSubmission = await prisma.codeSubmission.update({
            where: { id: submissionId },
            data: {
              filePath: result?.secure_url || ""
            }
          });
    
          return res.status(200).json({
            message: 'File updated successfully',
            file: updatedSubmission
          });
        });
    
        file.stream.pipe(upload);
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
      }
    
}

export const DeleteFilebyID = async (req: Request, res: Response) =>{

    try {
        const { submissionId } = req.params;
    
        const codeSubmission = await prisma.codeSubmission.findUnique({
          where: { id: submissionId }
        });
    
        if (!codeSubmission) {
          return res.status(404).json({ message: 'File not found' });
        }
    
        const publicId = codeSubmission.filePath.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.v2.uploader.destroy(publicId);
        }
    
        await prisma.codeSubmission.delete({
          where: { id: submissionId }
        });
    
        return res.status(200).json({ message: 'File deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
      }
    
}   