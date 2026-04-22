import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">

      <div className="flex gap-2">

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="w-3 h-3 bg-blue-500 rounded-full"
        />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
          className="w-3 h-3 bg-blue-500 rounded-full"
        />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
          className="w-3 h-3 bg-blue-500 rounded-full"
        />

      </div>

    </div>
  );
}

export default Loader;