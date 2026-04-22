import { useEffect, useState } from "react";
import API from "../utils/api";
import NewsCard from "../components/NewsCard";
import { FaFire } from "react-icons/fa";
import { motion } from "framer-motion";

function TrendingPage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/news/trending")
      .then(res => setTrending(res.data.news))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-red-100 dark:border-red-900/30">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
            LIVE TRAFFIC
          </div>
          <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 dark:text-white">
            <FaFire className="text-red-500" /> Trending Right Now
          </h1>
          <p className="text-gray-500 mt-4 text-lg font-medium max-w-2xl">
            Catch up on the stories everyone is talking about. Hand-picked and sorted by real-time engagement and views.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {trending.map(item => (
              <NewsCard key={item._id} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TrendingPage;
