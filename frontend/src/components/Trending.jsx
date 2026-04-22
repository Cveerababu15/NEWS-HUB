import { useEffect, useState } from "react";
import API from "../utils/api";
import { FaFire } from "react-icons/fa";

function Trending() {
  const [data, setData] = useState([]);

  const fetchTrending = async () => {
    try {
      const res = await API.get("/news/trending");
      setData(res.data.news.slice(0, 5));
    } catch (error) {
      console.log("Error fetching trending");
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">

      <h2 className="flex items-center gap-2 text-lg font-bold mb-4 dark:text-white">
        <FaFire className="text-red-500" />
        Trending
      </h2>

      <div className="space-y-3">

        {data.map((item) => (
          <p
            key={item._id}
            className="text-sm dark:text-gray-300 cursor-pointer hover:text-blue-500"
          >
            {item.title}
          </p>
        ))}

      </div>

    </div>
  );
}

export default Trending;