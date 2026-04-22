import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaArrowRight, FaChartLine, FaBolt, FaGlobe } from "react-icons/fa";

function Hero() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (query !== currentSearch) {
        const currentParams = Object.fromEntries([...searchParams]);
        if (query.trim()) {
            setSearchParams({ ...currentParams, search: query.trim() });
        } else {
            delete currentParams.search;
            setSearchParams(currentParams);
        }
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative pt-24 pb-12 overflow-hidden bg-white dark:bg-gray-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full delay-1000 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border border-blue-100 dark:border-blue-900/30"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            Live coverage updating constantly
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]"
          >
            Find the news that matters,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
               all in one place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium"
          >
            Stay completely informed with breaking global stories and thorough journalism selected exactly for your interests.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 w-full max-w-2xl group flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all shadow-2xl"
          >
            <div className="pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <FaSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Search for topics, countries or events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-gray-900 dark:text-white text-lg placeholder:text-gray-400"
            />
            <button 
              type="submit"
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:gap-3"
            >
              Search <FaArrowRight size={14} />
            </button>
          </motion.form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60"
          >
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FaGlobe className="text-blue-600" />
              <span className="font-bold">Global Coverage</span>
            </div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FaChartLine className="text-blue-600" />
              <span className="font-bold">Trending Topics</span>
            </div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FaBolt className="text-blue-600" />
              <span className="font-bold">Lightning Fast</span>
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
}

export default Hero;