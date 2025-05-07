// routes/accounts.js
const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accountsController");

// Créer un nouveau compte
router.post("/", accountsController.createAccount);

// Récupérer tous les comptes
router.get("/", accountsController.getAllAccounts);

// Récupérer un compte par ID
router.get("/:id", accountsController.getAccountById);

// Mettre à jour un compte
router.patch("/:id", accountsController.updateAccount);

// Supprimer un compte
router.delete("/:id", accountsController.deleteAccount);

module.exports = router;
