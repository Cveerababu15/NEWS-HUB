import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function SearchFilter({ onSearch }) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    language: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* SEARCH */}
        <div className="flex items-center border p-2 rounded dark:bg-gray-700">
          <FaSearch className="mr-2 text-gray-500" />
          <input
            type="text"
            name="search"
            placeholder="Search..."
            onChange={handleChange}
            className="w-full outline-none bg-transparent dark:text-white"
          />
        </div>

        {/* CATEGORY */}
        <select
          name="category"
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          <option>Technology</option>
          <option>Politics</option>
          <option>Sports</option>
          <option>Movies</option>
          <option>Business</option>
          <option>Health</option>
          <option>Education</option>
          <option>Crime</option>
        </select>

        {/* LANGUAGE */}
        <select
          name="language"
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Languages</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
          <option>Tamil</option>
          <option>Kannada</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded px-4"
        >
          Apply
        </button>

      </div>

    </div>
  );
}

export default SearchFilter;