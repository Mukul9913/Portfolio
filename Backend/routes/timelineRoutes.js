import express from "express";
import { deleteTimeLine, getAllTimeLine, postTimeine } from "../controllers/timelineController.js";
import { isAuthenticated } from "../middleware/auth.js";
const router=express.Router();
router.post("/add",isAuthenticated,postTimeine)
router.delete("/delete/:id",isAuthenticated,deleteTimeLine)
router.get("/getall",getAllTimeLine)
export default router;