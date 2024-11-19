import express from "express";
import {addSkill,deleteSkill,getallSkill, updateSkill } from "../controllers/skillController.js";
import { isAuthenticated } from "../middleware/auth.js";
const router=express.Router();
router.post("/add",isAuthenticated,addSkill)
router.delete("/delete/:id",isAuthenticated,deleteSkill)
router.put("/update/:id",isAuthenticated,updateSkill)
router.get("/getall",getallSkill)
export default router;