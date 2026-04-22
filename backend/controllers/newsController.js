const News=require("../models/News.js")
const cloudinary=require("../config/cloudinary.js");
const User = require("../models/User.js");
const { summarizeNews } = require("../utils/ai.js");
exports.createNews=async(req,res)=>{
    try{
        const {title,description,category,languages}=req.body;
        if(!title || !description){
            return res.status(400).json({message:"Title and Description are required"})
        }  
        const shortDesc=await summarizeNews(req.body.description);
        let imageUrls=[];

        // Limit processing explicitly to a maximum of 2 image files.
        if(req.files && req.files.length>0){
            if(req.files.length > 2){
                return res.status(400).json({message:"You can upload maximum 2 images"})
            }
            for(let file of req.files){
                const uploaded=await cloudinary.uploader.upload(file.path)
                imageUrls.push(uploaded.secure_url)
            }
        }
        const news=await News.create({
            title,
            description,
            shortDescription: shortDesc,
            category,
            languages,
            images:imageUrls,
            user:req.user.id
        })
        res.status(201).json({message:"News created successfully",news})
    }
    catch{
        res.status(500).json({message:"Error Creating News...."})
    }
}

exports.getNews = async (req, res) => {
    try {
      const {
        search,
        category,
        language,
        time,
        page = 1,
        limit = 5
      } = req.query;
  
      let query = {};
  

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ];
      }
  

      if (category) {
        query.category = category;
      }
  

      if (language) {
        query.languages = language;
      }
  

      if (time) {
        const now = new Date();
        let past;
  
        if (time === "24h") past = new Date(now - 24 * 60 * 60 * 1000);
        if (time === "7d") past = new Date(now - 7 * 24 * 60 * 60 * 1000);
        if (time === "30d") past = new Date(now - 30 * 24 * 60 * 60 * 1000);
  
        if (past) {
          query.createdAt = { $gte: past };
        }
      }
  

      const skip = (page - 1) * limit;
  
      const news = await News.find(query)
        .populate("user", "name profileImage")
        .populate("comments.user", "name profileImage")
        .populate("comments.replies.user", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
  
      const total = await News.countDocuments(query);
  
      res.status(200).json({
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        news
      });
  
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  };



  exports.toggleLike=async(req,res)=>{
    try{
        const news=await News.findById(req.params.id);

        if(!news){
            return res.status(404).json({message:"News not found"})
        }

        const userId = req.user ? req.user.id : req.body.guestId;
        if(!userId) return res.status(400).json({message:"User ID required"});

        const alreadyLiked=news.likes.includes(userId);

        if(alreadyLiked){
            news.likes=news.likes.filter(id=>id!==userId);
        }else{
            news.likes.push(userId);
        }
        await news.save();
        res.status(200).json({message:alreadyLiked?"Unliked":"Liked",totalLikes:news.likes.length})
    }
    catch(error){
        res.status(500).json({message:"Error toggling like"})

    }
  }


exports.addComment=async(req,res)=>{
    try{
        const {text, guestId, guestName, guestProfileImage}=req.body;
        if(!text){
            return res.status(400).json({message:"Comment text is required"})
        }
        const news=await News.findById(req.params.id);
        if(!news){
            return res.status(404).json({message:"News not found"})
        }
        const commentData = { text };
        if(req.user) commentData.user = req.user.id;
        else {
            commentData.guestId = guestId;
            commentData.guestName = guestName || "Anonymous Guest";
            commentData.guestProfileImage = guestProfileImage || "";
        }
        news.comments.push(commentData);
        await news.save();
        res.status(201).json({message:"Comment added successfully",totalComments:news.comments.length})
    }catch(error){
        res.status(500).json({message:"Error adding comment"})

    }
}



exports.deleteComment=async(req,res)=>{
    try{
        const {commentId, guestId}=req.body;
        const news=await News.findById(req.params.id);
        if(!news){
            return res.status(404).json({message:"News not found"})
        }
        const comment=news.comments.id(commentId);
        if(!comment){
            return res.status(404).json({message:"Comment not found"})
        }
        // Verify that the requester has administrative ownership over the primary article or the specific comment.
        const isUserOwner = req.user && comment.user && comment.user.toString() === req.user.id;
        const isGuestOwner = guestId && comment.guestId === guestId;
        const isNewsOwner = req.user && news.user && news.user.toString() === req.user.id;
        
        if(!isUserOwner && !isGuestOwner && !isNewsOwner){
            return res.status(403).json({message:"Unauthorized"})
        }
        
        news.comments.pull(commentId);
        await news.save();
        res.status(200).json({message:"Comment deleted successfully",totalComments:news.comments.length})
    }catch(error){
        res.status(500).json({message:"Error deleting comment"})

    }
}

exports.addReply=async(req,res)=>{
    try{
        const {text, guestId, guestName, guestProfileImage}=req.body;
        if(!text) return res.status(400).json({message:"Text required"});
        const news = await News.findById(req.params.id);
        if(!news) return res.status(404).json({message:"News not found"});
        const comment = news.comments.id(req.params.commentId);
        if(!comment) return res.status(404).json({message:"Comment not found"});
        
        const replyData = { text };
        if(req.user) replyData.user = req.user.id;
        else {
            replyData.guestId = guestId;
            replyData.guestName = guestName || "Anonymous Guest";
            replyData.guestProfileImage = guestProfileImage || "";
        }
        comment.replies.push(replyData);
        await news.save();
        res.status(201).json({message:"Reply added"});
    }catch(error){
        res.status(500).json({message:"Error adding reply"});
    }
}

exports.deleteReply=async(req,res)=>{
    try{
        const {guestId} = req.body;
        const news = await News.findById(req.params.id);
        const comment = news.comments.id(req.params.commentId);
        const reply = comment.replies.id(req.params.replyId);
        
        const isUserOwner = req.user && reply.user && reply.user.toString() === req.user.id;
        const isGuestOwner = guestId && reply.guestId === guestId;
        const isNewsOwner = req.user && news.user && news.user.toString() === req.user.id;
        if(!isUserOwner && !isGuestOwner && !isNewsOwner) return res.status(403).json({message:"Unauthorized"});
        comment.replies.pull(req.params.replyId);
        await news.save();
        res.status(200).json({message:"Reply deleted"});
    }catch(error){
        res.status(500).json({message:"Error deleting reply"});
    }
}

exports.toggleCommentLike=async(req,res)=>{
    try{
        const news = await News.findById(req.params.id);
        const comment = news.comments.id(req.params.commentId);
        const userId = req.user ? req.user.id : req.body.guestId;
        if(!userId) return res.status(400).json({message:"User ID required"});
        
        const alreadyLiked = comment.likes.includes(userId);
        if(alreadyLiked){
            comment.likes = comment.likes.filter(id=>id!==userId);
        }else{
            comment.likes.push(userId);
        }
        await news.save();
        res.status(200).json({message:alreadyLiked?"Unliked":"Liked"});
    }catch(error) { res.status(500).json({message:"Error toggling comment like"}); }
}





exports.getTrendingNews=async(req,res)=>{
    try{
        const last24Hours=new Date(Date.now()-24*60*60*1000);
        let news=await News.find({createdAt:{$gte:last24Hours}})
        .populate("user","name profileImage")

        if (news.length === 0) {
            news = await News.find().populate("user","name profileImage");
        }

        // Compute algorithmic trending score based strictly on engagement arrays and total views.
        const sorted=news.map(item => ({
            ...item._doc,
            score:
            item.likes.length * 2 + item.comments.length *3 + item.views
        })) 
        .sort((a,b) => b.score - a.score)
        res.status(200).json({
            message:"Trending News",
            news:sorted.slice(0, 10)
        })

    }catch(error){
        res.status(500).json({message:"Error fetching trending news"})

    }
}



exports.getSingleNews=async(req,res)=>{
    try{
        const news=await News.findById(req.params.id)
        .populate("user","name profileImage")
        .populate("comments.user", "name profileImage")
        .populate("comments.replies.user", "name profileImage")
        if(!news){
            return res.status(404).json({message:"News not found"})
        }

        res.status(200).json({message:"News fetched successfully",news})
    }
    catch(error){
        res.status(500).json({message:"Error fetching news"})
    }
}

exports.incrementViews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: "News not found" });
        news.views += 1;
        await news.save();
        res.status(200).json({ message: "View recorded" });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}




exports.getRecommededNews=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id);
        const interests = user.interests || [];

        // Execute the trending topic fallback querying if the user has no defined topic arrays.
        if (interests.length === 0) {
          const trending = await News.find().sort({ views: -1 }).limit(10);
          return res.status(200).json({
              message: "Trending News (No interests selected)",
              news: trending
          });
        }


        const news = await News.find({ category: { $in: interests } })
        .sort({ createdAt: -1 })
        .limit(10);

        res.status(200).json({
            message: "Recommended News",
            news
        });
        
    } catch (error) {
        res.status(500).json({message:"Error fetching recommended news"})
        
    }
}

exports.updateNews = async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
  
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      if (news.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }
  
      const { title, description, category, languages } = req.body;
  
      const updated = await News.findByIdAndUpdate(
        req.params.id,
        { title, description, category, languages },
        { new: true }
      );
  
      res.status(200).json({
        message: "News updated",
        updated
      });
  
    } catch (error) {
      res.status(500).json({ message: "Error updating news" });
    }
  };



  exports.deleteNews = async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
  
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }
  
      // Verify the authorization of the user object against the embedded news publisher identifier.
      if (news.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }
  
      await News.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        message: "News deleted successfully"
      });
  
    } catch (error) {
      res.status(500).json({ message: "Error deleting news" });
    }
  };