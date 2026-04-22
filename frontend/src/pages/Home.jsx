import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../utils/api";
import Hero from "../components/Hero";
import NewsCard from "../components/NewsCard";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Home() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const language = searchParams.get("language") || "";

  const fetchNews = async () => {
    try {
      if (category === "For You") {
        if (!user) {
          toast.error("Please login for personalized recommendations");
          setNews([]);
          return;
        }
        const res = await API.get("/news/recommend");
        setNews(res.data.news);
      } else {
        const res = await API.get(`/news?search=${search}&category=${category}&language=${language}`);
        if (search && res.data.news.length === 0) {
           toast.error(`No news found for "${search}". Displaying all topics.`);
           const currentParams = Object.fromEntries([...searchParams]);
           delete currentParams.search;
           setSearchParams(currentParams);
        } else {
           setNews(res.data.news);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch stories");
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await API.get("/news/trending");
      setTrending(res.data.news?.slice(0, 3) || []);
    } catch (error) {
      // safe fallback if trending missing
    }
  };

  useEffect(() => {
    fetchNews();
    if (!search && !category && !language) {
      fetchTrending();
    }
  }, [search, category, language]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Hero />
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none w-full py-3 px-1 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest pl-2 pr-4 shrink-0">Topics</span>
            <button 
              onClick={() => setSearchParams({ search, category: "", language })}
              className={`shrink-0 whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${
                !category ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 -translate-y-0.5" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setSearchParams({ search, category: "For You", language })}
              className={`shrink-0 whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                category === "For You" ? "bg-red-500 text-white shadow-md shadow-red-500/40 -translate-y-0.5" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              For You
            </button>
            {["Politics", "Technology", "Movies", "Crime", "Sports", "Education", "Business", "Health"].map(c => (
              <button 
                key={c}
                onClick={() => setSearchParams({ search, category: c, language })}
                className={`shrink-0 whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  category === c ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 -translate-y-0.5" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none w-full pb-2 px-1">
            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest pl-2 pr-4 shrink-0">Region</span>
            <button 
              onClick={() => setSearchParams({ search, category, language: "" })}
              className={`shrink-0 whitespace-nowrap px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                !language ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform -translate-y-0.5" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Global
            </button>
            {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Bengali"].map(l => (
              <button 
                key={l}
                onClick={() => setSearchParams({ search, category, language: l })}
                className={`shrink-0 whitespace-nowrap px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                  language === l ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform -translate-y-0.5" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!search && !category && trending.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <span className="bg-red-500 p-1 rounded text-white text-xs">HOT</span> Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trending.map(item => (
              <NewsCard key={item._id} item={item} />
            ))}
          </div>
          <hr className="mt-12 border-gray-100 dark:border-gray-800" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12 pb-20">

        <h2 className="text-2xl font-bold mb-8 dark:text-white flex items-center justify-between">
          <span>{search ? `Search Results: "${search}"` : category === "For You" ? "Recommended For You" : "Latest Stories"}</span>
          <span className="text-sm font-normal text-gray-500">{news?.length || 0} items</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {news?.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}

          {news?.length === 0 && category === "For You" && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="col-span-full text-center py-20 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900 mx-auto w-full max-w-3xl flex flex-col items-center justify-center shadow-xl"
            >
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 mt-4">Personalized Feed</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 font-medium">
                 Build a custom feed with exactly the news you care about. Update your profile settings to select your favorite topics.
              </p>
              <Link to="/profile" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg transition-transform hover:scale-105 hover:-translate-y-1 block">
                 Update Profile Settings
              </Link>
            </motion.div>
          )}

          {news?.length === 0 && category !== "For You" && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No news found matching your criteria.</p>
            </div>
          )}
        </motion.div>

      </div>

    </div>
  );
}

export default Home;