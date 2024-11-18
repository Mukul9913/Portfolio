import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    senderName:{
    type:"string",
    minLength:[2,"Name should be atleast 2 characters"],
    },
    subject:{
    type:"string",
    minLength:[2,"Subject should be atleast 2 characters"],
    },
    message:{
    type:"string",
    minLength:[2,"Message should be atleast 2 characters"], 
    },
    createdAt:{
    type:"date",
    default:Date.now,
    } 
})

export const Message=mongoose.model("Message",messageSchema)