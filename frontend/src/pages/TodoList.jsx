import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Check, Edit, Delete, Logout } from "@mui/icons-material";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    reloadTasks();
  }, []);

  const reloadTasks = () => {
    fetch("http://localhost:3001/tasks", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired, please login again");
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((data) => setTasks(data));
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ token
    window.location.href = "/login"; // กลับไปหน้า login
  };

  const handleAddTask = () => {
    if (!name || !dateStart) return alert("กรุณากรอกข้อมูลให้ครบ");

    if (editId !== null) {
      fetch(`http://localhost:3001/tasks/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ name, date_start: dateStart }),
      })
        .then((res) => res.json())
        .then(() => {
          setEditId(null);
          setName("");
          setDateStart("");
          reloadTasks();
        });
    } else {
      fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ name, date_start: dateStart }),
      })
        .then((res) => res.json())
        .then(() => {
          setName("");
          setDateStart("");
          reloadTasks();
        });
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(() => reloadTasks());
  };

  const handleToggleFinished = (id, finished) => {
    fetch(`http://localhost:3001/tasks/${id}/finished`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ finished: !finished }),
    }).then(() => reloadTasks());
  };

  const handleEdit = (task) => {
    setName(task.name);
    setDateStart(task.date_start);
    setEditId(task.id);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        {/* Header + Logout */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">📋 Todo List</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {/* Input Form */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="ชื่องาน"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="วันที่เริ่ม"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
          <Button
            variant="contained"
            color={editId ? "warning" : "primary"}
            onClick={handleAddTask}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ชื่อ</TableCell>
                <TableCell>วันที่เริ่ม</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell align="center">การจัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ยังไม่มีงานในรายการ
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task, index) => (
                  <TableRow
                    key={task.id}
                    sx={{
                      backgroundColor: task.finished ? "#e8f5e9" : "inherit",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell
                      sx={{
                        textDecoration: task.finished ? "line-through" : "none",
                        color: task.finished ? "gray" : "inherit",
                      }}
                    >
                      {task.name}
                    </TableCell>
                    <TableCell>
                      {task.date_start
                        ? new Intl.DateTimeFormat("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            timeZone: "Asia/Bangkok",
                          }).format(new Date(task.date_start))
                        : ""}
                    </TableCell>
                    <TableCell>
                      {task.finished ? "✅ เสร็จแล้ว" : "❌ ยังไม่เสร็จ"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="success"
                        onClick={() =>
                          handleToggleFinished(task.id, task.finished)
                        }
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        color="warning"
                        onClick={() => handleEdit(task)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
