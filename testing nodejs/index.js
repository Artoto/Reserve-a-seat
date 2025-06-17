const express = require("express");
const app = express();
const path = require("path"); // เพิ่ม path module
const expressSession = require("express-session");
const flash = require("connect-flash");
//Routes
const renderRoutes = require("./routes/renderRoutes.js");
const storeRoutes = require("./routes/storeRoutes");
//db connection
require("./db.js");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(flash());
app.use(
  expressSession({
    secret: "mysecretkey",
  })
);

app.set("view engine", "ejs");

// Routes
app.use("/", renderRoutes);
app.use("/api", storeRoutes);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
