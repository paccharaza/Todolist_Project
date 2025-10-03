const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(3001, () => {
  console.log("✅ Server running on https://todolist-backend.up.railway.app");
});
