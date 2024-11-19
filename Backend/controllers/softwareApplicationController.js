import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import {v2 as cloudinary} from "cloudinary";
import ErrorHandler from "../middleware/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
export const addApplication=catchAsyncErrors(async(req,res,next)=>{
    if(!req.files|| Object.keys(req.files).length===0){
        return next(new ErrorHandler("Software Application Icon/SVG Required",400));
    }
    const {svg}=req.files;
    const {name}=req.body;
    if(!name){
        return next(new ErrorHandler("Software Application Name is required",400))
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(svg.tempFilePath,{folder:"PORTFOLIO_SOFTWAREAPPLICATIONS"})
    if(!cloudinaryResponse ||cloudinaryResponse.error){
        console.log("Cloudinary Error",cloudinaryResponse.error||"Unknown Error");
    }
    const softwareApplication=await SoftwareApplication.create({
        name,
        svg:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        },
    });
    softwareApplication.save();
    res.status(200).json({
        success:true,
        message:"New Software Application Added!",
        softwareApplication,
    })
})
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ success: false, message: "Application ID is required" });
    }

    const application = await SoftwareApplication.findById(id);
    
    if (!application) {
        return next(new ErrorHandler("SoftwareApplication not found", 404));
    }

    try {
        if (application.svg && application.svg.public_id) {
            await cloudinary.uploader.destroy(application.svg.public_id);
        }

        await application.deleteOne();

        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler("Error deleting application", 500));
    }
});

export const getallApplication=catchAsyncErrors(async(req,res,next)=>{
    const softwareApplication=await SoftwareApplication.find();
    if(!softwareApplication){
        return next(new ErrorHandler("SoftwareApplication not found",404))
       }
       res.status(200).json({
        success:true,
        message:softwareApplication
       })
})