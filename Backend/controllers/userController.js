import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js"
import ErrorHandler, { errorMiddleware } from "../middleware/error.js"
import {User} from "../models/userSchema.js"
import {v2 as cloudinary} from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto  from "crypto";


export const register=catchAsyncErrors(async(req,res,next)=>{
    if(!req.files|| Object.keys(req.files).length===0){
        return next(new ErrorHandler("Avatar & Resume Are required",400));
    }
    const {avatar,resume}=req.files;
    const cloudinaryResponseforAvatar=await cloudinary.uploader.upload(avatar.tempFilePath,{folder:"AVATARS"})
    if(!cloudinaryResponseforAvatar ||cloudinaryResponseforAvatar.error){
        console.log("Cloudinary Error",cloudinaryResponseforAvatar.error||"Unknown Error");
    }
    const cloudinaryResponseforResume=await cloudinary.uploader.upload(resume.tempFilePath,{folder:"RESUME"})
    if(!cloudinaryResponseforResume ||cloudinaryResponseforResume.error){
    }
    const {fullname,email,phone,aboutMe,password,portfolioUrl}=req.body;
    if(!fullname || !email || !phone || !aboutMe || !password){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const userExist=await User.findOne({email});
    if(userExist){
        return next(new ErrorHandler("User already exists",400));
    }
    const user=await User.create({
        fullname,
        email,
        phone,
        aboutMe,
        password,
        portfolioUrl,
        avatar:{
            public_id:cloudinaryResponseforAvatar.public_id,
            url:cloudinaryResponseforAvatar.secure_url
        },
        resume:{
            public_id:cloudinaryResponseforResume.public_id,
            url:cloudinaryResponseforResume.secure_url
        }
    })
    generateToken(user,"User Registered Successfully",201,res);
})

export const login=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User not found",400));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Incorrect password",400));
    }
    generateToken(user,"User logged in successfully",201,res);
})
 
export const logout=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true,
        secure:process.env.NODE_ENV==="development"?false:true,
        sameSite:"none"
    }).json({
        success:true,
        message:"User logged out successfully"
    })
})
export const getUsers=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find({});
    res.status(200).json({
        message:"Users fetched successfully",
        status:true,
        data:users
    })
})
export const getUser=catchAsyncErrors(async(req,res,next)=>{
    const id=req.user.id;
    if(!id){
        return next(new ErrorHandler("Please provide id",400));
    }
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",400));
    }
    res.status(200).json({
        message:"User fetched successfully",
        status:true,
        data:user
    })
})
export const deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    if(!id){
        return next(new ErrorHandler("Please provide id",400));
    }
    const user=await User.findByIdAndDelete(id);
    if(!user){
        return next(new ErrorHandler("User not found",400));
    }
    res.status(200).json({
        message:"User deleted successfully",
        status:true,
        data:user
})
})
    
export const updateUser=catchAsyncErrors(async(req,res,next)=>{
    const id=req.user.id;
    if(!id){
        return next(new ErrorHandler("Please provide id",400));
    }
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",400));
    }
    const {fullname,email,phone,aboutMe,portfolioUrl,githubUrl,instagramUrl,twitterUrl,linkedInUrl}=req.body;
    if(!fullname || !email || !phone || !aboutMe || !portfolioUrl){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const newUserData={
        fullname,
        email,
        phone,
        aboutMe,
        portfolioUrl,
        githubUrl,
        instagramUrl,
        twitterUrl,
        linkedInUrl
    }
    if(req.files && req.files.avatar){
        const avatar=req.files.avatar;
        const profileImageId=user.avatar.public_id;
        await cloudinary.uploader.destroy(profileImageId);
        const cloudinaryResponseforAvatar=await cloudinary.uploader.upload(avatar.tempFilePath,{folder:"AVATARS"})
        newUserData.avatar={
            public_id:cloudinaryResponseforAvatar.public_id,
            url:cloudinaryResponseforAvatar.secure_url
        }
    }
    if(req.files && req.files.resume){
        const resume=req.files.resume;
        const resumeId=user.resume.public_id;
        await cloudinary.uploader.destroy(resumeId);
        const cloudinaryResponseforResume=await cloudinary.uploader.upload(resume.tempFilePath,{folder:"RESUME"})
        newUserData.resume={
            public_id:cloudinaryResponseforResume.public_id,
            url:cloudinaryResponseforResume.secure_url
        }
    }
    const updatedUser=await User.findByIdAndUpdate(id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        message:"User updated successfully",
        status:true,
        user:updatedUser
    })
})
export const updatepassword=catchAsyncErrors(async(req,res,next)=>{
    const id=req.user.id;
    if(!id){
        return next(new ErrorHandler("Please provide id",400));
    }
    const user=await User.findById(id).select("+password");
    if(!user){
        return next(new ErrorHandler("User not found",400));
    }
    const {oldPassword,newPassword,confimPassword}=req.body;
    if(!oldPassword || !newPassword || !confimPassword){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const isPasswordMatched=await user.comparePassword(oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Incorrect password",400));
    }
    if(newPassword!==confimPassword){
        return next(new ErrorHandler("Password does not match",400));
    }
    user.password=newPassword;
    await user.save();
    res.status(200).json({
        message:"Password updated successfully",
        success:true
    })
})
export const getPortfolio=catchAsyncErrors(async(req,res,next)=>{
    const id="6741edd6a851ea8f43dc38e9";
    if(!id){
        return next(new ErrorHandler("Please provide id",400));
    }
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",400));
    }
    res.status(200).json({
        message:"Portfolio fetched successfully",
        status:true,
        user:user
    })
})
export const forgetPasswod=catchAsyncErrors(async(req,res,next)=>{
    const {email}=req.body;
    if(!email){
        return next(new ErrorHandler("Please provide email",400));
    }
    const user=await User.findOne({email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    } 
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`${process.env.DASHBOARD_URL}/reset-password/${resetToken}`;
    const message = 
    `<html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h1 style="color: #4a4a4a; text-align: center;">Password Reset Request</h1>
          <p>Dear User,</p>
          <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p>To reset your password, please click on the button below:</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${resetPasswordUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px;">Reset Password</a>
          </div>
          <p style="margin-top: 30px;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="word-break: break-all;">${resetPasswordUrl}</p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>Your App Team</p>
        </div>
      </body>
    </html>`
    try {
        await sendEmail({
            email:user.email,
            subject:"Personal Portfolio Dashboard Recovery Password",
            message:message
        });
        res.status(200).json({
            message:`Email sent to ${user.email} successfully`,
            success:true
        })
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }
    ;})

export const resetPassword=catchAsyncErrors(async(req,res,next)=>{
        const {token}=req.params;
        const resetPasswordToken=crypto.createHash("sha256").update(token).digest("hex");
        const user=await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}
        })
        if(!user){
            return next(new ErrorHandler("Invalid token or token expired",400));
        }
        if(req.body.password!==req.body.confirmPassword){
            return next(new ErrorHandler("Password does not match",400));
        }
        user.password=req.body.password;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save();
        generateToken(user,"Password reset successfully",201,res);
        res.status(200).json({
            message:"Password reset successfully",
            success:true
        });
    })