const db = require("../db");

// ✅ Créer un nouveau compte
async function createAccount(req, res) {
    const { owner_name, balance, bank_id } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO accounts (owner_name, balance, bank_id) VALUES (?, ?, ?)",
            [owner_name, balance, bank_id]
        );
        res.status(201).json({
            message: "✅ Compte créé avec succès!",
            account_id: result.insertId,
        });
    } catch (err) {
        console.error("❌ Erreur création compte :", err.message);
        res.status(500).json({ message: "Erreur lors de la création du compte" });
    }
}

// ✅ Récupérer tous les comptes
async function getAllAccounts(req, res) {
    try {
        const [rows] = await db.query("SELECT * FROM accounts");
        res.status(200).json(rows);
    } catch (err) {
        console.error("❌ Erreur récupération comptes :", err.message);
        res.status(500).json({ message: "Erreur lors de la récupération des comptes" });
    }
}

// ✅ Récupérer un compte par ID
async function getAccountById(req, res) {
    const accountId = req.params.id;
    try {
        const [rows] = await db.query("SELECT * FROM accounts WHERE account_id = ?", [accountId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: "Compte non trouvé" });
        }
    } catch (err) {
        console.error("❌ Erreur récupération compte :", err.message);
        res.status(500).json({ message: "Erreur lors de la récupération du compte" });
    }
}

// ✅ Mise à jour du solde SANS toucher `owner_name` ni `bank_id`
async function updateBalance(accountId, amountChange) {
    try {
        const [currentData] = await db.query("SELECT owner_name, bank_id FROM accounts WHERE account_id = ?", [accountId]);

        if (!currentData.length) {
            console.error("❌ Compte introuvable !");
            return false;
        }

        const [result] = await db.query(
            "UPDATE accounts SET balance = balance + ? WHERE account_id = ?",
            [amountChange, accountId]
        );

        console.log(`✅ Solde mis à jour pour le compte ${accountId}, nouveau solde ajouté : ${amountChange}`);
        return result.affectedRows > 0;
    } catch (err) {
        console.error("❌ Erreur mise à jour solde :", err.message);
        return false;
    }
}

// ✅ Supprimer un compte
async function deleteAccount(req, res) {
    const accountId = req.params.id;
    try {
        const [result] = await db.query("DELETE FROM accounts WHERE account_id = ?", [accountId]);

        if (result.affectedRows > 0) {
            console.log(`✅ Compte ${accountId} supprimé avec succès !`);
            res.status(200).json({ message: "Compte supprimé avec succès" });
        } else {
            console.error("❌ Compte non trouvé, impossible de supprimer !");
            res.status(404).json({ message: "Compte non trouvé" });
        }
    } catch (err) {
        console.error("❌ Erreur suppression compte :", err.message);
        res.status(500).json({ message: "Erreur lors de la suppression du compte" });
    }
}

module.exports = {
    createAccount,
    getAllAccounts,
    getAccountById,
    updateBalance,
    deleteAccount,
};
