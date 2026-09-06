import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  clearUnreadMessage,
  getAllMessages,
  newMessage,
} from "../controller/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/new-message", isAuthenticated, newMessage);
messageRouter.get("/get-all-messages/:chatId", isAuthenticated, getAllMessages);
messageRouter.get(
  "/clear-unread-message/:chatId",
  isAuthenticated,
  clearUnreadMessage,
);

export default messageRouter;
