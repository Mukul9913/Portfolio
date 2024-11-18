import mongoose from "mongoose";
const dbConnection=async()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"portfolio",
    }
    ).then((data)=>{
        console.log(`Database is connected with ${data.connection.host}`);
    }).catch((err)=>{
        console.log("Some Error Occured While conecting the mongoDB",err);
    })
}

export default dbConnection;