import express from 'express'
import  {AllProject, createProject, DeleteProjectbyID, ProjectbyID, UpdateProjectbyID } from '../controllers/project.controller'
import { AddMember, RemoveMember } from '../controllers/members.controller'

export const projects = express.Router()

//Projects

projects.post('/', createProject )

projects.get('/', AllProject )

projects.get('/:projectID', ProjectbyID )

projects.put('/:projectID', UpdateProjectbyID )

projects.delete('/:projectID', DeleteProjectbyID )

// Project Members

projects.post('/:projectID/members', AddMember )

projects.delete('/:projectID/members/:userId', RemoveMember)
