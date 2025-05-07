// controllers/accountsController.js
const db = require("../db");

// Créer un nouveau compte
async function createAccount(req, res) {
  const { owner_name, balance, bank_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO accounts (owner_name, balance, bank_id) VALUES (?, ?, ?)",
      [owner_name, balance, bank_id]
    );
    res.status(201).json({
      message: "Compte créé avec succès!",
      account_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création du compte" });
  }
}

// Récupérer tous les comptes
async function getAllAccounts(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM accounts");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des comptes" });
  }
}

// Récupérer un compte par ID
async function getAccountById(req, res) {
  const accountId = req.params.id;
  try {
    const [rows] = await db.query(
      "SELECT * FROM accounts WHERE account_id = ?",
      [accountId]
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "Compte non trouvé" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du compte" });
  }
}

// Mettre à jour un compte
async function updateAccount(req, res) {
  const accountId = req.params.id;
  const { owner_name, balance, bank_id } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE accounts SET owner_name = ?, balance = ?, bank_id = ? WHERE account_id = ?",
      [owner_name, balance, bank_id, accountId]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Compte mis à jour avec succès" });
    } else {
      res.status(404).json({ message: "Compte non trouvé" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du compte" });
  }
}

// Supprimer un compte
async function deleteAccount(req, res) {
  const accountId = req.params.id;
  try {
    const [result] = await db.query(
      "DELETE FROM accounts WHERE account_id = ?",
      [accountId]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Compte supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Compte non trouvé" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du compte" });
  }
}

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
