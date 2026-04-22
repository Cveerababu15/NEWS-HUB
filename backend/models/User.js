const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{type:String,required:[true,"Please enter your name"]},
    email:{type:String,required:[true,"Please enter your email"],unique:true},
    password:{type:String,required:[true,"Please enter your password"]},
    profileImage:{type:String},
    language:{
        type:String,
        default:"English"
    },
    interests:[String],   // politics ,tech, sports, entertainment
    role:{
        type:String,
        default:"user"
    },
    bookmarks: [
        { type: mongoose.Schema.Types.ObjectId, ref: "News" }
      ],
},
{timestamps:true}
)
module.exports=mongoose.model("User",userSchema)