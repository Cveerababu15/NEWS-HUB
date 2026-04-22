import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaNewspaper, FaTags, FaGlobe, FaChevronRight } from "react-icons/fa";

function CreateNews() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technology",
    languages: "English"
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      API.get(`/news/${id}`).then(res => {
        const n = res.data.news;
        setForm({ title: n.title, description: n.description, category: n.category, languages: n.languages || "English" });
        setPreviews(n.images || []);
      }).catch(err => { toast.error("Failed to load news"); });
    }
  }, [id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // HANDLE IMAGE
  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) return toast.error("Max 2 images allowed");
    
    setImages(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error("All fields required");
    
    setLoading(true);
    try {
      if (id) {
        await API.put(`/news/${id}`, form);
        toast.success("News updated successfully!");
        navigate(`/news/${id}`);
      } else {
        const data = new FormData();
        data.append("title", form.title);
        data.append("description", form.description);
        data.append("category", form.category);
        data.append("languages", form.languages);
        images.forEach((img) => data.append("images", img));

        await API.post("/news/create", data);
        toast.success("News published successfully!");
        
        setForm({ title: "", description: "", category: "Technology", languages: "English" });
        setImages([]);
        setPreviews([]);
      }
    } catch (error) {
      toast.error(id ? "Failed to update news" : "Failed to publish news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-12">
        
        {/* LEFT - FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-10"
        >
          <div>
             <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{id ? "Edit News" : "Create News"}</h2>
             <p className="text-gray-500 font-medium italic">{id ? "Update your story settings." : "Share your story with the world’s pulse."}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Headlines</label>
               <input
                type="text"
                name="title"
                placeholder="Enter a catchy headline..."
                value={form.title}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none dark:text-white text-xl font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700"
              />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">The Full Story</label>
               <textarea
                name="description"
                rows="8"
                placeholder="Write your news content here..."
                value={form.description}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none dark:text-white font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Category</label>
                  <div className="relative">
                    <FaTags className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select name="category" value={form.category} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 pl-12 pr-4 py-4 rounded-xl border-none outline-none dark:text-white font-bold appearance-none">
                      {["Politics", "Technology", "Movies", "Crime", "Sports", "Education", "Business", "Health"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Language</label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select name="languages" value={form.languages} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 pl-12 pr-4 py-4 rounded-xl border-none outline-none dark:text-white font-bold appearance-none">
                      {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Bengali"].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
               </div>
            </div>

            <button 
              disabled={loading}
              className={`w-full group bg-blue-600 text-white py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 hover:gap-5 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:translate-y-1 ${loading ? "opacity-50" : ""}`}
            >
              {loading ? "Saving..." : (id ? "Update News" : "Publish News")} <FaChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

          </form>
        </motion.div>

        {/* RIGHT - UPLOAD */}
        <motion.div 
           initial={{ opacity: 0, x: 30 }} 
           animate={{ opacity: 1, x: 0 }}
           className="space-y-8"
        >
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl">
             <h3 className="text-xl font-black dark:text-white mb-6">Visual Content</h3>
             
             <label className="w-full aspect-[4/3] border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group overflow-hidden">
                {previews.length > 0 ? (
                   <div className="grid grid-cols-1 w-full h-full">
                      <img src={previews[0]} className="w-full h-full object-cover" />
                   </div>
                ) : (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                       <FaCloudUploadAlt size={40} className="text-blue-600" />
                    </div>
                    <p className="font-bold dark:text-white">Click to Upload</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">JPEG, PNG (Max 2 MB)</p>
                  </>
                )}
                <input type="file" multiple onChange={handleImage} className="hidden" />
             </label>

             {previews.length > 1 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                   <img src={previews[1]} className="w-full h-24 object-cover rounded-xl border-2 border-gray-100 dark:border-gray-800" />
                   <div className="bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 font-black">+1</div>
                </div>
             )}
          </div>

          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white">
             <div className="flex items-center gap-3 mb-4">
                <FaNewspaper size={24} />
                <h4 className="font-bold">Pro Tip</h4>
             </div>
             <p className="text-sm text-blue-50 leading-relaxed font-medium">
               High-quality visuals increase engagement by over 40%. Make sure your images are clear and relevant to the story.
             </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default CreateNews;