//this requirerole is a middleware generator is for the role based access control -> allows only user with specific roles to access certain routes
//everyone else gets a 403 forbidden

export const requireRole = (...roles)=>(req,res,next)=>{
    if(!req.user || !roles.includes(req.user.role)){
        return res.status(403).json({message:"Forbidden"});
    }
    next();
};
