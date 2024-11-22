import express from "express";
import {addProject,deleteProject,getallProject, getSingleProject, updateProject } from "../controllers/projectControlller.js";
import { isAuthenticated } from "../middleware/auth.js";
const router=express.Router();
router.post("/add",isAuthenticated,addProject)
router.delete("/delete/:id",isAuthenticated,deleteProject)
router.put("/update/:id",isAuthenticated,updateProject)
router.get("/getall",getallProject)
router.get("/get/:id",getSingleProject)
export default router;