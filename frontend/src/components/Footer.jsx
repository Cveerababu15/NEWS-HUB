import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaPaperPlane } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* INFO */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <span className="text-xl font-bold dark:text-white">NEWSHUB</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Your premier destination for high-quality journalism. Our website exclusively features Real-Time Live Searching, AI-Powered Recommendations, Bookmark functionality, and diverse News Categories.
            </p>
            <div className="flex gap-4 text-gray-400 dark:text-gray-500 text-xl">
              <FaFacebook className="hover:text-blue-600 cursor-pointer transition-colors" />
              <FaTwitter className="hover:text-blue-400 cursor-pointer transition-colors" />
              <FaInstagram className="hover:text-pink-500 cursor-pointer transition-colors" />
              <FaGithub className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-bold mb-6 dark:text-white">Quick Access</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Home Feed</Link></li>
              <li><Link to="/trending" className="hover:text-blue-600 transition-colors">Trending News</Link></li>
              <li><Link to="/bookmarks" className="hover:text-blue-600 transition-colors">Saved Stories</Link></li>
              <li><Link to="/create" className="hover:text-blue-600 transition-colors">Submit a Post</Link></li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h4 className="font-bold mb-6 dark:text-white">Topics</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <li><Link to="/?category=Technology" className="hover:text-blue-600 transition-colors cursor-pointer">Technology</Link></li>
              <li><Link to="/?category=Politics" className="hover:text-blue-600 transition-colors cursor-pointer">Politics & Law</Link></li>
              <li><Link to="/?category=Education" className="hover:text-blue-600 transition-colors cursor-pointer">Science & Education</Link></li>
              <li><Link to="/?category=Sports" className="hover:text-blue-600 transition-colors cursor-pointer">Sports & Health</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="font-bold mb-6 dark:text-white">Stay Notified</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Get the morning's most important stories delivered to your inbox.
            </p>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="bg-transparent flex-1 px-3 py-2 text-sm outline-none dark:text-white"
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                <FaPaperPlane size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs">
          <p>© 2026 all rights reserved to Veerababu.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;