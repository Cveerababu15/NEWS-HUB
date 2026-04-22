import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { FaHeart, FaBookmark, FaRegHeart, FaRegBookmark, FaShare, FaCalendarAlt, FaTrash, FaEdit, FaReply, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const [news, setNews] = useState(null);
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});
  const [loading, setLoading] = useState(true);



  const fetchNews = async () => {
    try {
      const res = await API.get(`/news/${id}`);
      setNews(res.data.news);
    } catch (error) {
      toast.error("Failed to fetch news details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [id]);

  const handleLike = async () => {
    try {
      const payload = user ? {} : {};
      await API.post(`/news/like/${id}`, payload);
      fetchNews();
    } catch (error) {
      toast.error("Error toggling like");
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await API.post(`/user/bookmark/${id}`);
      setIsSaved(!isSaved);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Login required to bookmark");
    }
  };

  const handleComment = async () => {
    if (!comment) return;
    if (!user) return toast.error("Please login to comment");
    try {
      const payload = { text: comment };
      await API.post(`/news/comment/${id}`, payload);
      setComment("");
      toast.success("Comment added");
      fetchNews();
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const payload = user ? { commentId } : { commentId };
      await API.delete(`/news/comment/${id}`, { data: payload });
      toast.success("Comment deleted");
      fetchNews();
    } catch (error) {
      toast.error("Error deleting comment");
    }
  };

  const handleReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text) return;
    if (!user) return toast.error("Please login to reply");
    try {
      const payload = { text };
      await API.post(`/news/comment/${id}/reply/${commentId}`, payload);
      setReplyText({ ...replyText, [commentId]: "" });
      setShowReplyBox({ ...showReplyBox, [commentId]: false });
      toast.success("Reply added");
      fetchNews();
    } catch (error) {
      toast.error("Error adding reply");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const payload = user ? {} : {};
      await API.delete(`/news/comment/${id}/reply/${commentId}/${replyId}`, { data: payload });
      toast.success("Reply deleted");
      fetchNews();
    } catch (error) {
      toast.error("Error deleting reply");
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const payload = user ? {} : {};
      await API.post(`/news/comment/${id}/like/${commentId}`, payload);
      fetchNews();
    } catch (error) {
      toast.error("Error liking comment");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled share voluntarily
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDeleteNews = async () => {
    if(window.confirm("Are you sure you want to delete this news?")) {
      try {
        await API.delete(`/news/${id}`);
        toast.success("News deleted");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete news");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!news) return <p className="text-center mt-10">News not found</p>;

  const currentUserId = user?._id || user?.id; // depending on auth context shape
  const isNewsOwner = currentUserId && news.user?._id === currentUserId;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="space-y-4 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                {news.category}
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold ml-2">
                <FaCalendarAlt />
                {new Date(news.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {isNewsOwner && (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(`/edit/${id}`)} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors">
                  <FaEdit size={14} />
                </button>
                <button onClick={handleDeleteNews} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors">
                  <FaTrash size={14} />
                </button>
              </div>
            )}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight"
          >
            {news.title}
          </motion.h1>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
             <div className="flex items-center gap-3">
                <img 
                  src={news.user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                  alt="author"
                />
                <div>
                   <p className="text-sm font-black dark:text-white">{news.user?.name || "Anonymous"}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Journalist</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-400 font-bold text-sm">
                   <FaEye size={18} /> {news.views || 0}
                </div>
                <button onClick={handleLike} className={`flex items-center gap-1.5 font-black text-sm hover:scale-110 transition-transform ${news.likes?.includes(currentUserId) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                   {news.likes?.includes(currentUserId) ? <FaHeart size={18} /> : <FaRegHeart size={18} />} {news.likes?.length}
                </button>
                <button onClick={handleBookmark} className={`transition-colors ${isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
                   {isSaved ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
                </button>
                <button onClick={handleShare} className="text-gray-400 hover:text-green-500 transition-colors">
                  <FaShare size={18} />
                </button>
             </div>
          </div>
        </div>
        {news.images?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 group bg-gray-100 dark:bg-gray-900"
          >
            <div className="relative w-full h-[300px] sm:h-[450px]">
              <img
                src={news.images[currentImg]}
                alt={`news-${currentImg}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            {news.images.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImg(prev => (prev - 1 + news.images.length) % news.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={() => setCurrentImg(prev => (prev + 1) % news.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <FaChevronRight />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {news.images.map((_, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentImg(idx)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentImg ? 'bg-white w-4' : 'bg-white/50'}`} 
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-8 italic border-l-4 border-blue-600 pl-6">
            {news.shortDescription}
          </p>
          <div className="text-gray-700 dark:text-gray-300 leading-[1.8] text-lg space-y-6">
            {news.description.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        <div className="mt-20 pt-20 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-2xl font-black dark:text-white mb-8 flex items-center gap-3">
             Comments <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">{news.comments?.length || 0}</span>
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] mb-12 flex items-start gap-4 ring-1 ring-gray-100 dark:ring-gray-800">
             <img src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-10 h-10 rounded-full" alt="user" />
             <div className="flex-1 space-y-3">
               <textarea
                placeholder="What are your thoughts?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-transparent border-none outline-none dark:text-white resize-none h-20 text-sm font-medium"
               />
               <div className="flex justify-end">
                  <button
                    onClick={handleComment}
                    className="bg-blue-600 text-white px-8 py-2 rounded-full text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Post
                  </button>
               </div>
             </div>
          </div>
          <div className="space-y-8">
            {news.comments?.map((c) => {
              const isCommentOwner = (currentUserId && c.user?._id === currentUserId);
              const canDeleteComment = isNewsOwner || isCommentOwner;

              return (
                <div key={c._id} className="flex gap-4 group">
                  <img
                    src={c.user?.profileImage || c.guestProfileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-10 h-10 rounded-full object-cover shadow-md"
                    alt="commenter"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl group-hover:bg-gray-100 dark:group-hover:bg-gray-900 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-black text-sm dark:text-white">{c.user?.name || c.guestName || "Guest"}</span>
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {canDeleteComment && (
                              <button onClick={() => handleDeleteComment(c._id)} className="text-red-400 hover:text-red-600 ml-2">
                                <FaTrash />
                              </button>
                            )}
                         </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
                        {c.text}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs font-bold text-gray-400">
                        <button onClick={() => handleCommentLike(c._id)} className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <FaHeart className={c.likes?.includes(currentUserId) ? "text-red-500" : ""} /> {c.likes?.length || 0}
                        </button>
                        <button onClick={() => setShowReplyBox({ ...showReplyBox, [c._id]: !showReplyBox[c._id] })} className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <FaReply /> Reply
                        </button>
                      </div>
                    </div>
                    {showReplyBox[c._id] && (
                      <div className="flex items-start gap-3 mt-4 ml-4">
                        <img src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full" alt="currentUser" />
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 rounded-full px-4 py-1">
                          <input 
                            type="text" 
                            placeholder="Write a reply..." 
                            value={replyText[c._id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [c._id]: e.target.value })}
                            className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white py-2"
                          />
                          <button onClick={() => handleReply(c._id)} className="text-blue-600 font-bold text-sm hover:underline">Post</button>
                        </div>
                      </div>
                    )}
                    {c.replies?.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                        {c.replies.map((reply) => {
                          const isReplyOwner = (currentUserId && reply.user?._id === currentUserId);
                          const canDeleteReply = isNewsOwner || isReplyOwner;

                          return (
                            <div key={reply._id} className="flex gap-3">
                              <img src={reply.user?.profileImage || reply.guestProfileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full" alt="replier" />
                              <div className="flex-1 bg-gray-50 dark:bg-gray-900/40 p-3 rounded-2xl">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs dark:text-white">{reply.user?.name || reply.guestName || "Guest"}</span>
                                    <span className="text-[9px] text-gray-400 uppercase tracking-widest">{new Date(reply.createdAt).toLocaleDateString()} at {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  {canDeleteReply && (
                                    <button onClick={() => handleDeleteReply(c._id, reply._id)} className="text-red-400 hover:text-red-600 text-[10px]">
                                      <FaTrash />
                                    </button>
                                  )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-xs font-medium">{reply.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NewsDetails;