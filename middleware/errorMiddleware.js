//notFond->catches unkown routes (404);
//errorHandler->catches all the thrown errors and formats the response nicely

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found - ${req.originalUrl}`));
};

export const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode && res.statusCode !==200? res.statusCode:500;
    res.status(statusCode).json({
        message:err.message || "Server error",
        stack:process.env.NODE_ENV==="production"?"🥞":err.stack
        //in production it hides the stack trace (replaces with 🥞), and in dev it shows the real stack.
    })
}
