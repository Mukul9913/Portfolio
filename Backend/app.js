import express from "express"
import dontenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app=express();
app.use(cors({origin:[process.env.PORTFORLIO_URL,process.env.DASHBOARD_URL],methods:["GET","POST","PUT","DELETE"],credentials:true}));
dontenv.config({path:"./config/config.env"});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({useTempFiles:true,tempFileDir:"/tmp/"}))
app.use("/api/v1/message",messageRoutes);
app.use("/api/v1/user",userRoutes);
dbConnection();
app.use(errorMiddleware)
export default app;