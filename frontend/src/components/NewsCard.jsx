import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaComment, FaBookmark, FaRegHeart, FaRegBookmark, FaShareAlt, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

function NewsCard({ item }) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [liked, setLiked] = useState(item.likes?.includes(user?.id) || false);
  const [likesCount, setLikesCount] = useState(item.likes?.length || 0);
  const [viewsCount, setViewsCount] = useState(item.views || 0);

  const handleCardClick = () => {
    setViewsCount(prev => prev + 1);
    API.put(`/news/view/${item._id}`).catch(() => {});
  };

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to like");
    try {
      const res = await API.post(`/news/like/${item._id}`);
      setLiked(!liked);
      setLikesCount(res.data.totalLikes);
    } catch (error) {
      toast.error("Error toggling like");
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to bookmark");
    try {
      const res = await API.post(`/user/bookmark/${item._id}`);
      setIsSaved(!isSaved);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error toggling bookmark");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <Link to={`/news/${item._id}`} onClick={handleCardClick} className="block relative aspect-[4/3] overflow-hidden">
        {/* CATEGORY BADGE */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
          {item.category}
        </div>

        {/* IMAGE */}
        <img
          src={item.images?.[0] || "https://images.unsplash.com/photo-1504711331083-9c897511ff5a?q=80&w=2070&auto=format&fit=crop"}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* CONTENT */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
            <img 
              src={item.user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
               By {item.user?.name || "Anonymous"} • {new Date(item.createdAt).toLocaleDateString()}
            </span>
        </div>

        <Link to={`/news/${item._id}`} onClick={handleCardClick}>
          <h2 className="text-xl font-bold dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {item.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
            {item.shortDescription || item.description}
          </p>
        </Link>

        {/* FOOTER ACTIONS */}
        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition ${liked ? 'text-red-500 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
            >
              {liked ? <FaHeart size={18} /> : <FaRegHeart size={18} />} 
              <span className="font-bold">{likesCount}</span>
            </button>

            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
              <FaComment size={17} className="hover:text-blue-600 cursor-pointer transition-colors" />
              <span className="font-bold">{item.comments?.length || 0}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-sm">
              <FaEye size={16} />
              <span className="font-medium">{viewsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <FaShareAlt size={16} className="text-gray-400 hover:text-green-500 cursor-pointer transition-colors" />
             <button onClick={handleBookmark} className={`transition-colors ${isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
               {isSaved ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NewsCard;