const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/guestflow_db")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
