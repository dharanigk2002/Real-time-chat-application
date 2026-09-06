import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { createNewChat, getAllChats } from "../controller/chat.controller.js";

const router = express.Router();
router.post("/create-new-chat", isAuthenticated, createNewChat);
router.get("/get-all-chats", isAuthenticated, getAllChats);

export default router;
