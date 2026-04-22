const express=require("express");
const router=express.Router();
const auth=require("../middleware/authMiddleware.js")
const optionalAuth=require("../middleware/optionalAuth.js")
const upload=require("../middleware/upload.js");
const { createNews, getNews, toggleLike, addComment, deleteComment, addReply, toggleCommentLike, deleteReply, getTrendingNews, getSingleNews, getRecommededNews, updateNews, deleteNews, incrementViews } = require("../controllers/newsController");

router.post("/create",auth,upload.array("images",2),createNews);
router.get("/",getNews)
router.post("/like/:id",optionalAuth,toggleLike)
router.post("/comment/:id",optionalAuth,addComment)
router.delete("/comment/:id",optionalAuth,deleteComment)
router.post("/comment/:id/reply/:commentId",optionalAuth,addReply)
router.delete("/comment/:id/reply/:commentId/:replyId",optionalAuth,deleteReply)
router.post("/comment/:id/like/:commentId",optionalAuth,toggleCommentLike)
router.get("/trending",getTrendingNews)
router.get("/recommend",auth,getRecommededNews)
router.get("/:id",getSingleNews)
router.put("/view/:id",incrementViews)
router.put("/:id",auth,updateNews)
router.delete("/:id",auth,deleteNews)
module.exports=router;