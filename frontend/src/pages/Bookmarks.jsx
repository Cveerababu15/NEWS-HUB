import { useEffect, useState } from "react";
import API from "../utils/api";
import NewsCard from "../components/NewsCard";
import toast from "react-hot-toast";

function Bookmarks() {
  const [data, setData] = useState([]);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/user/bookmarks");
      setData(res.data.bookmarks);
    } catch (error) {
      toast.error("Login required");
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">

      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Saved News
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          No bookmarks yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Bookmarks;