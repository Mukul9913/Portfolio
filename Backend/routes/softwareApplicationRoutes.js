import express from "express";
import { addApplication,getallApplication, deleteApplication } from "../controllers/softwareApplicationController.js";
import { isAuthenticated } from "../middleware/auth.js";
const router=express.Router();
router.post("/add",isAuthenticated,addApplication)
router.delete("/delete/:id",isAuthenticated,deleteApplication)
router.get("/getall",getallApplication)
export default router;