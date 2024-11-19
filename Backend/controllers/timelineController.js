import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import ErrorHandler from "../middleware/error.js";
import { Timeline } from "../models/timelineSchema.js";

export const postTimeine=catchAsyncErrors(async(req,res,next)=>{
    const {title,description,from,to}=req.body;
    const newTimeline=await Timeline.create({title,description,timeline:{from,to}})
    res.status(200).json({
        success:true,
        message:"Timeline Added",
        newTimeline
    })

})
export const deleteTimeLine=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    if(!id){
        res.status(400).json({success:false})
    }
   const timeline=await Timeline.findById(id);
   if(!timeline){
    return next(new ErrorHandler("Timeline not found",404))
   }
   await timeline.deleteOne();
   res.status(200).json({
    success:true,
    message:"Timeline deleted"
   })
})
export const getAllTimeLine=catchAsyncErrors(async(req,res,next)=>{
    const timeline=await Timeline.find();
    if(!timeline){
        return next(new ErrorHandler("Timeline not found",404))
       }
       res.status(200).json({
        success:true,
        message:timeline
       })

})