import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema=new mongoose.Schema(
    {
        fullname:{
            type:String,
            required:[true,"Please enter your name"]
        },
        email:{
            type:String,
            required:[true,"Please enter your email"],
            unique:true
        },
        phone:{
            type:String,
            required:[true,"Please enter your phone number"]
        },
        aboutMe:{
            type:String,
            required:[true,"Please enter about yourself"]
        },
        password:{
            type:String,
            required:[true,"Please enter your password"],
            minLength:[8,"Password must be at least 8 characters"],
            select:false
        },
        avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        },
        resume:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        },
        portfolioUrl:{
            type:String,
            required:[true,"Please enter your portfolio url"]
        },
        gitHubUrl:String,
        linkedInUrl:String,
        twitterUrl:String,
        facebookUrl:String,
        instagramUrl:String,
        resetPasswordToken:String,
        resetPasswordExpire:Date

    }
);
// hash password before saving
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})

// compare password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// json web token
userSchema.methods.generateJsonWebToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
    })
}
// reset password
userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+15*60*1000;
    return resetToken;
}
export const User=mongoose.model("User",userSchema);