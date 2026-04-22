import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaUserCircle, FaPlus, FaBookmark, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass-nav py-2" : "bg-transparent py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
            NEWS<span className="text-blue-600">HUB</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/trending" className="hover:text-blue-600 transition-colors">Trending</Link>
          <Link to="/bookmarks" className="hover:text-blue-600 transition-colors">Saved</Link>
          {user && <Link to="/create" className="flex items-center gap-1 hover:text-blue-600 transition-colors bg-blue-600 text-white px-3 py-1.5 rounded-full"><FaPlus size={10}/> Create</Link>}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <FaSun className="hidden dark:block" />
            <FaMoon className="block dark:hidden" />
          </button>

          {user ? (
            <div className="flex items-center gap-3 relative group">
              <Link to="/profile" className="flex items-center gap-2">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold dark:text-white">{user.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.role}</p>
                </div>
                <img 
                  src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  className="w-10 h-10 rounded-full border-2 border-blue-600 object-cover shadow-md"
                />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">
              Login
            </Link>
          )}

          {/* MOBILE TOGGLE */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-2xl dark:text-white">
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 font-bold text-gray-800 dark:text-gray-200">
              <Link to="/" onClick={() => setMobileMenu(false)} className="hover:text-blue-600">Home</Link>
              <Link to="/trending" onClick={() => setMobileMenu(false)} className="hover:text-blue-600">Trending</Link>
              <Link to="/bookmarks" onClick={() => setMobileMenu(false)} className="hover:text-blue-600">Saved</Link>
              {user && <Link to="/create" onClick={() => setMobileMenu(false)} className="text-blue-600">Create News</Link>}
              {user && <button onClick={() => { logout(); setMobileMenu(false); }} className="text-red-500 text-left">Logout</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;