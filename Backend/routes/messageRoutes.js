import express from "express";
import { sendMessage,getAllMessages,deleteMessage } from "../controllers/messageController.js";
import { isAuthenticated } from "../middleware/auth.js";
const router=express.Router();
router.post("/sendMessage",sendMessage)
router.get("/getAllMessages",getAllMessages)
router.delete("/deleteMessage/:id",isAuthenticated,deleteMessage)
export default router;