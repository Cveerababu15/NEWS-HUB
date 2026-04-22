import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields required");
    }

    try {
      await API.post("/auth/register", form);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col md:flex-row-reverse">
      
      {/* RIGHT SIDE - VISUAL */}
      <div className="hidden md:flex md:w-1/2 bg-purple-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700 opacity-90" />
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
           <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-xl w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30"
          >
            <span className="text-white text-5xl font-black">N</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-white mb-6 leading-tight"
          >
            Be the First to Know. Always.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-purple-100 text-lg font-medium"
          >
            Join millions of readers worldwide. Create your account and start your personalized journey today.
          </motion.p>
        </div>
      </div>

      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-sm"
        >
          <div className="md:hidden flex justify-center mb-8">
            <div className="bg-purple-600 p-3 rounded-xl shadow-lg">
              <span className="text-white font-black text-2xl">N</span>
            </div>
          </div>

          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Create Account</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-10 font-medium">Join us for a personalized news experience.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-purple-600 transition-all">
                <FaUser className="text-gray-400 mr-4" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-purple-600 transition-all">
                <FaEnvelope className="text-gray-400 mr-4" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Password</label>
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-purple-600 transition-all">
                <FaLock className="text-gray-400 mr-4" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none dark:text-white font-medium"
                />
              </div>
            </div>

            <button className="w-full bg-gray-900 dark:bg-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-xl shadow-purple-500/10 active:shadow-none">
              Get Started <FaArrowRight size={14} />
            </button>
          </form>

          <p className="text-center mt-12 text-gray-500 dark:text-gray-400 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-extrabold hover:underline">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}

export default Register;