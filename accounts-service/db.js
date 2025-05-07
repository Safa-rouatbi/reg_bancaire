const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "safa",
  database: "interbank",
});

module.exports = pool;
