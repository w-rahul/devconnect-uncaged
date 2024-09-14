import express from 'express'
import { DeleteFilebyID, getFile, getFilebyID, PostFile, UpdateFilebyID } from '../controllers/code.controller'
import multer from "multer"
import { Authenticate } from '../middlewares/Auth'
import { CheckMember } from '../middlewares/CheckMember'
import { CheckCreatorOrContributor } from '../middlewares/CreatorOrContributor'


const storage = multer.memoryStorage()
const upload = multer ({ storage })

export const code = express.Router()

code.post('/:ProjectId/code/:UserId/', Authenticate, CheckMember, CheckCreatorOrContributor, upload.single('file'), PostFile);

code.get('/code', Authenticate, getFile);

code.get('/:ProjectId/code', Authenticate, getFilebyID);

code.put('/:ProjectId/code/:submissionId', Authenticate, CheckMember, CheckCreatorOrContributor, upload.single('file'), UpdateFilebyID);

code.delete('/:ProjectId/code/:submissionId', Authenticate, CheckMember, CheckCreatorOrContributor, DeleteFilebyID);