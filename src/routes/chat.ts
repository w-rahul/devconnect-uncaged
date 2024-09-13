import express from "express";
import { CreateChat, GetChat } from "../controllers/chat.controller";

export const chat  = express.Router()

chat.post('/:id', CreateChat )

chat.get('/:id', GetChat )