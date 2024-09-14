import express from 'express'
import  {AllProject, createProject, DeleteProjectbyID, ProjectbyID, UpdateProjectbyID } from '../controllers/project.controller'
import { AddMember, RemoveMember } from '../controllers/members.controller'
import { Authenticate } from '../middlewares/Auth'
import { OwnershipCheck } from '../middlewares/Authorize'

export const projects = express.Router()

//Projects

projects.post('/', Authenticate , createProject )

projects.get('/', AllProject )

projects.get('/:projectID', Authenticate, ProjectbyID )

projects.put('/:projectID', Authenticate, OwnershipCheck , UpdateProjectbyID )

projects.delete('/:projectID', Authenticate, OwnershipCheck, DeleteProjectbyID )

// Project Members

projects.post('/:projectID/members', Authenticate, AddMember )

projects.delete('/:projectID/members/:userId', Authenticate, RemoveMember)