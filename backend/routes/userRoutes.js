const express=require('express');
const router=express.Router();

const auth=require("../middleware/authMiddleware.js");
const upload=require("../middleware/upload.js")



const { getProfile, updateProfile, toggleBookmark, getBookmarks, getmyPosts }=require("../controllers/userController.js")


router.get("/profile",auth,getProfile);
router.put("/profile",auth,upload.single("profileImage"),updateProfile)
router.post("/bookmark/:id",auth,toggleBookmark)
router.get("/bookmarks",auth,getBookmarks)
router.get("/myposts",auth,getmyPosts)

module.exports=router;