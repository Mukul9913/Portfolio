import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js"
import ErrorHandler, { errorMiddleware } from "../middleware/error.js"
import {Message} from "../models/messageSchema.js"

export const sendMessage=catchAsyncErrors(async(req,res,next)=>{
    const {senderName,subject,message}=req.body;
    if(!senderName || !subject || !message)
    return next(new ErrorHandler("Plase fill all the fields",400));
    const data=await Message.create({senderName,subject,message});
     res.status(200).json({
        message:"Message sent successfully",
        status:true,
        data:data
    })
})

export const getAllMessages=catchAsyncErrors(async(req,res,next)=>{
    console.log("get all messages")
    const data=await Message.find({});
    res.status(200).json({
        message:"Messages fetched successfully",
        status:true,
        data:data
    })
})

export const  deleteMessage=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    if(!id){
        return next(new ErrorHandler("Please provide id",400));
    }
    const data=await Message.findByIdAndDelete(id);
    if(!data){
        return next(new ErrorHandler("Message not found",400));
    }
    res.status(200).json({
        message:"Message deleted successfully",
        status:true,
        data:data
    })
})