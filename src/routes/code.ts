import express from 'express'
import { DeleteFilebyID, getFile, getFilebyID, PostFile, UpdateFilebyID } from '../controllers/code.controller'

export const code = express.Router()

code.post('/:id/code', PostFile )

code.get('/code', getFile)

code.get('/:id/code', getFilebyID)

code.put('/:id/code/:submissionId', UpdateFilebyID )

code.delete('/:id/code/:submissionId', DeleteFilebyID )