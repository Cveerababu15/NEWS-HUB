import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

// attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const NewsAPI = {
  getNews: (query) => API.get(`/news${query}`),
  getSingleNews: (id) => API.get(`/news/${id}`),
  getTrendingNews: () => API.get("/news/trending"),
  getRecommendedNews: () => API.get("/news/recommend"),
  createNews: (data) => API.post("/news", data),
  updateNews: (id, data) => API.put(`/news/${id}`, data),
  deleteNews: (id) => API.delete(`/news/${id}`),
  likeNews: (id, payload) => API.post(`/news/like/${id}`, payload),
  commentNews: (id, payload) => API.post(`/news/comment/${id}`, payload),
  deleteComment: (id, data) => API.delete(`/news/comment/${id}`, { data }),
  replyComment: (id, commentId, payload) => API.post(`/news/comment/${id}/reply/${commentId}`, payload),
  deleteReply: (id, commentId, replyId, data) => API.delete(`/news/comment/${id}/reply/${commentId}/${replyId}`, { data }),
  likeComment: (id, commentId, payload) => API.post(`/news/comment/${id}/like/${commentId}`, payload)
};

export const UserAPI = {
  login: (data) => API.post("/user/login", data),
  register: (data) => API.post("/user/register", data),
  getProfile: () => API.get("/user/profile"),
  updateProfile: (data) => API.put("/user/profile", data),
  toggleBookmark: (id) => API.post(`/user/bookmark/${id}`),
  getBookmarks: () => API.get("/user/bookmarks")
};

export default API;