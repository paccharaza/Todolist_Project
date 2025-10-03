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

// ใช้ PORT จาก Railway หรือ fallback เป็น 3001 เวลา dev
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
