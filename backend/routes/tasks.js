const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get all tasks (ต้อง login ก่อน)
router.get("/", authenticateToken, (req, res) => {
  db.query("SELECT * FROM todolist", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Add new task
router.post("/", authenticateToken, (req, res) => {
  const { name, date_start } = req.body;
  db.query(
    "INSERT INTO todolist (name, date_start, finished) VALUES (?, ?, ?)",
    [name, date_start, false],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Task created", id: result.insertId });
    }
  );
});

// ✅ Update task (ชื่อ + วันที่เริ่ม)
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, date_start } = req.body;
  db.query(
    "UPDATE todolist SET name=?, date_start=? WHERE id=?",
    [name, date_start, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Task updated" });
    }
  );
});

// ✅ Update finished only
router.put("/:id/finished", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { finished } = req.body;
  db.query(
    "UPDATE todolist SET finished=? WHERE id=?",
    [finished, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Finished status updated" });
    }
  );
});

// ✅ Delete task
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM todolist WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Task deleted" });
  });
});

module.exports = router;
