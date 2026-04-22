const User=require("../models/User.js")
const cloudinary=require("../config/cloudinary.js");
const News = require("../models/News.js");

exports.getProfile=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        res.status(200).json({
            message:"Profile Fetched Successfully",
            user
        })
    } catch (error) {
        res.status(500).json({message:"Error At While Fetching Profile"})
        
    }
}

exports.updateProfile=async(req,res)=>{
    try {
        const {name,email,language, interests}=req.body;
        let imageUrl="";

        if(req.file){
            const uploaded=await cloudinary.uploader.upload(req.file.path);
            imageUrl=uploaded.secure_url;
        }
        const updated=await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email,
                language,
                ...(interests && { interests: JSON.parse(interests) }),
                ...(imageUrl && {profileImage:imageUrl})
            },
            {new:true}
        );
        res.status(200).json({
            message:"Profile Updated Successfully",
            user:updated
        })
    } catch (error) {
        res.status(500).json({message:"Error At While Updating Profile"})
        
    }
}


exports.toggleBookmark=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id);
        const newsId=req.params.id;
        const exists=user.bookmarks.includes(newsId);

        if(exists){
            user.bookmarks=user.bookmarks.filter(id=>id.toString()!==newsId)
        } else{
            user.bookmarks.push(newsId);
        }

        await user.save();
        
        res.status(200).json({
            message: exists ? "Removed From bookmarks " : "Added to bookmarks"
        })
    } catch (error) {
        res.status(500).json({message:"Error At While Toggling Bookmark"})
        
    }
}


exports.getBookmarks=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).populate("bookmarks").select("bookmarks");
        res.status(200).json({
            message:"Bookmarks Fetched Successfully",
            bookmarks:user.bookmarks
        })
        
    } catch (error) {
        res.status(500).json({message:"Error At While Fetching Bookmarks"})
        
    }
}

exports.getmyPosts=async(req,res)=>{
    try {
        const posts=await News.find({ user:req.user.id})
        res.status(200).json({
            message:"Your Posts Fetched Successfully",
            posts
        })
        
    } catch (error) {
        res.status(500).json({message:"Error At While Fetching Your Posts"})
        
    }
}