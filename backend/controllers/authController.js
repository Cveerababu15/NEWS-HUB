const User=require("../models/User.js")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

exports.register=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const existing=await User.findOne({email});
        if(existing){
            return res.status(400).json({message:"User Already Exists"})
        }
        const hash=await bcrypt.hash(password,10);
    const user=await User.create({name,email,password:hash})
    return res.status(201).json({
        message:"User Registered Successfully",
        user
    })
    } catch (error) {
        res.status(500).json({message:"Error At While Registering"})
        
    }
}
exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Email"})
        }
        const match=await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(400).json({message:"Invalid Password"})
        }
        const token=jwt.sign(
            {id:user._id,role:user.role}
            ,"secretkey",
            {expiresIn:"7d"}
        );
        return res.status(200).json({
            message:"Login Successful",
            token,
            user
        })
        
    } catch (error) {
        res.status(500).json({message:"Error At While Login"})
        
    }
}