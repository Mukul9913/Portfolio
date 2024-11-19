import mongoose from "mongoose";
const timelineSchema=new mongoose.Schema({
    title:{
    type:String,
    required:[true,"Title Required!"],
    },
    description:{
        type:String,
        required:[true,"Description Required!"]
    },
    timeline:{
        from:{type:String,
            required:[true,"Start timeline is requrired"]
        },
        to: String
    },
})

export const Timeline=mongoose.model("Timeline",timelineSchema)