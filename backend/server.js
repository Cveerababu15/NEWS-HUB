require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes=require("./routes/authRoutes.js")
const userRoutes=require("./routes/userRoutes.js");
const newsRoutes=require("./routes/newsRoutes.js")
const connectDB = require("./config/db.js");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// DB CONNECT
connectDB();

// ROUTES
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes)
app.use("/api/news",newsRoutes)


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("NewsHub API Running....");
});

// GLOBAL ERROR HANDLER (IMPORTANT)
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Multer Error: ${err.message}. Make sure you are using the correct field name (profileImage).` });
  }
  console.log(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// SERVER START
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});