const jwt=require("jsonwebtoken");
module.exports=(req,res,next)=>{
    try {
        const token=req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({message:"No Token Provided"})
        }
        const decoded=jwt.verify(token,"secretkey");
        req.user=decoded;
        next();
    } catch (error) {
        res.status(401).json({message:"Invalid Token "})
        
    }
}