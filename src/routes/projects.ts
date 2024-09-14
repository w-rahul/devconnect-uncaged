import express from 'express'
import  {AllProject, createProject, DeleteProjectbyID, ProjectbyID, UpdateProjectbyID } from '../controllers/project.controller'
import { AddMember, RemoveMember } from '../controllers/members.controller'
import { Authenticate } from '../middlewares/Auth'

export const projects = express.Router()

//Projects

projects.post('/', Authenticate , createProject )

projects.get('/', AllProject )

projects.get('/:projectID', Authenticate, ProjectbyID )

projects.put('/:projectID', Authenticate, UpdateProjectbyID )

projects.delete('/:projectID', Authenticate, DeleteProjectbyID )

// Project Members

projects.post('/:projectID/members', AddMember )

projects.delete('/:projectID/members/:userId', RemoveMember)
