const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",     // เปลี่ยนตามของคุณ
  database: "todolist"
});

module.exports = db;
