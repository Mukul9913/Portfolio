class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Internal Server Error";
    err.statusCode=err.statusCode || 500;
    if(err.code===11000){
        err.message=`Duplicate ${Object.keys(err.keyValue)} Entered`; 
      
        err=new ErrorHandler(err.message,400);
    }
    if(err.name==='JsonWebTokenError'){
        err.message=`Json Web Token Is Invalid. Try Again!`;   
        err=new ErrorHandler(err.message,400);
    }    if(err.name==="TokenExpiredError"){
        err.message=`Json Web Token Is Expired. Try Again!`; 
        err=new ErrorHandler(err.message,400);
    }    if(err.name==="CastError"){
        err.message=`invalid ${err.path}`  
        err=new ErrorHandler(err.message,400);
    }
    const errorMessage=err.errors?
    Object.values(err.errors).map((error)=>error.message).join(', '):err.message;
    console.log(errorMessage);
    return res.status(err.statusCode).json({
        success:false,
        message:errorMessage
    })
}
export default ErrorHandler;