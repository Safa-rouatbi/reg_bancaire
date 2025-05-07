// db.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "safa", // Remplace par ton mot de passe MySQL si besoin
  database: "banking_db", // Assure-toi que cette base existe
});

module.exports = pool;
