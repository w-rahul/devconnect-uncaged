import express from "express";
import { CreateChat, GetChat } from "../controllers/chat.controller";
import { Authenticate } from "../middlewares/Auth";
import { CheckMember } from "../middlewares/CheckMember";

export const chat  = express.Router()

chat.post('/:projectID/:userID', Authenticate, CheckMember, CreateChat);

chat.get('/:projectID/:userID', Authenticate, CheckMember, GetChat);