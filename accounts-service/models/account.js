const db = require("../db");

async function getAllAccounts() {
  const [rows] = await db.query("SELECT * FROM accounts");
  return rows;
}

async function getAccountById(id) {
  const [rows] = await db.query("SELECT * FROM accounts WHERE account_id = ?", [
    id,
  ]);
  return rows[0];
}

async function createAccount({ owner_name, balance, bank_id }) {
  const [result] = await db.query(
    "INSERT INTO accounts (owner_name, balance, bank_id) VALUES (?, ?, ?)",
    [owner_name, balance, bank_id]
  );
  return { account_id: result.insertId, owner_name, balance, bank_id };
}

async function updateAccount(id, data) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);
  await db.query(
    `UPDATE accounts SET ${fields.join(", ")} WHERE account_id = ?`,
    values
  );
}

async function deleteAccount(id) {
  await db.query("DELETE FROM accounts WHERE account_id = ?", [id]);
}

module.exports = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
