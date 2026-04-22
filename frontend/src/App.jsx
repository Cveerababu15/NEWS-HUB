import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateNews from "./pages/CreateNews";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import NewsDetails from "./pages/NewsDetails";
import TrendingPage from "./pages/TrendingPage";

function App() {
  return (
    <BrowserRouter>



      <MainLayout>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/trending" element={<TrendingPage />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER */}
          <Route path="/create" element={<CreateNews />} />
          <Route path="/edit/:id" element={<CreateNews />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />

        </Routes>

      </MainLayout>

    </BrowserRouter>
  );
}

export default App;