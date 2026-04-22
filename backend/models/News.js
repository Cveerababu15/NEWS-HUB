const mongoose=require("mongoose");

const newsSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    images:[String], // max 2 
    category:{
        type:String,
        enum:["Politics", "Technology", "Movies", "Crime", "Sports", "Education", "Business", "Health"]
    },
    languages:{
        type:String,
        enum:["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Bengali"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[{type:String}],
    comments:[{
        user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        guestId: String,
        guestName: String,
        guestProfileImage: String,
        text:String,
        likes:[{type:String}],
        replies:[{
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            guestId: String,
            guestName: String,
            guestProfileImage: String,
            text:String,
            likes:[{type:String}],
            createdAt:{type:Date,default:Date.now}
        }],
        createdAt:{type:Date,default:Date.now}
    }],
    views:{type:Number,default:0},
    shortDescription: String,
},
{timestamps:true}
)
module.exports=mongoose.model("News",newsSchema)