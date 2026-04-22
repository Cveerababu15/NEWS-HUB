import { useEffect, useState } from "react";
import API from "../utils/api";
import NewsCard from "../components/NewsCard";
import { FaUserCircle, FaSignOutAlt, FaCog, FaTh, FaBookmark, FaEdit, FaCamera, FaHeart, FaComment } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, fetchUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    language: "",
    interests: []
  });
  const availableInterests = ["Politics", "Technology", "Movies", "Crime", "Sports", "Education", "Business", "Health"];
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        language: user.language || "English",
        interests: user.interests || []
      });
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const newsRes = await API.get("/user/myposts");
      setPosts(newsRes.data.posts || []);
      
      const bookRes = await API.get("/user/bookmarks");
      setBookmarks(bookRes.data.bookmarks || []);
    } catch (error) {
      console.log("Error fetching profile data");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("language", form.language);
    data.append("interests", JSON.stringify(form.interests));
    if (image) data.append("profileImage", image);

    try {
      await API.put("/user/profile", data);
      toast.success("Profile updated!");
      setIsEditing(false);
      fetchUser(); // refresh global user state
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading your news profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-12 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div className="relative group">
           <img 
            src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-50 dark:border-gray-900 shadow-xl"
           />
           <button onClick={() => setIsEditing(true)} className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full border-4 border-white dark:border-gray-950 hover:scale-110 transition-transform shadow-lg">
             <FaCamera size={14} />
           </button>
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <h2 className="text-3xl font-light dark:text-white">{user.name}</h2>
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="bg-gray-100 dark:bg-gray-800 dark:text-white px-6 py-1.5 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Edit Profile
              </button>
              <button onClick={logout} className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <FaSignOutAlt />
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-8 text-lg">
             <div className="dark:text-white"><span className="font-bold">{posts.length}</span> <span className="text-gray-500 font-medium">Stories</span></div>
             <div className="dark:text-white"><span className="font-bold">{bookmarks.length}</span> <span className="text-gray-500 font-medium">Saved</span></div>
          </div>

          <div className="space-y-1">
             <p className="font-bold dark:text-white">{user.name}</p>
             <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Language: <span className="text-blue-600 font-bold">{user.language}</span></p>
             <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Journalist & News Enthusiast</p>
             {user.interests?.length > 0 && (
               <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {user.interests.map(i => (
                     <span key={i} className="text-[10px] uppercase font-black tracking-widest bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full">
                        {i}
                     </span>
                  ))}
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="flex justify-center border-t border-gray-200 dark:border-gray-800 -mt-12 mb-8">
        <button 
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-12 py-4 border-t-2 transition-all font-bold tracking-widest text-xs uppercase ${activeTab === "posts" ? "border-gray-900 dark:border-white text-gray-900 dark:text-white" : "border-transparent text-gray-400"}`}
        >
          <FaTh size={14} /> Stories
        </button>
        <button 
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-12 py-4 border-t-2 transition-all font-bold tracking-widest text-xs uppercase ${activeTab === "saved" ? "border-gray-900 dark:border-white text-gray-900 dark:text-white" : "border-transparent text-gray-400"}`}
        >
          <FaBookmark size={14} /> Saved
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
         <AnimatePresence mode="wait">
            {(activeTab === "posts" ? posts : bookmarks).map((item) => (
               <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
               >
                 <NewsCard item={item} />
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {(activeTab === "posts" ? posts : bookmarks).length === 0 && (
         <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No {activeTab} available yet</p>
         </div>
      )}

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.form 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onSubmit={handleUpdate}
              className="bg-white dark:bg-gray-900 w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black dark:text-white">Settings</h3>
                <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500">Close</button>
              </div>

              <div className="space-y-4">
                 <div>
                   <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Full Name</label>
                   <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border-none outline-none dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Change Avatar</label>
                   <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Language</label>
                   <select 
                    value={form.language} 
                    onChange={(e) => setForm({...form, language: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border-none outline-none dark:text-white"
                   >
                     {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Bengali"].map(l => (
                        <option key={l} value={l}>{l}</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Favourite Topics (For You)</label>
                   <div className="flex flex-wrap gap-2">
                     {availableInterests.map(topic => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            if (form.interests.includes(topic)) {
                               setForm({...form, interests: form.interests.filter(t => t !== topic)});
                            } else {
                               setForm({...form, interests: [...form.interests, topic]});
                            }
                          }}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${form.interests.includes(topic) ? "bg-red-500 text-white shadow-md shadow-red-500/30 transform -translate-y-0.5" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                        >
                          {topic}
                        </button>
                     ))}
                   </div>
                 </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                Save Changes
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Profile;