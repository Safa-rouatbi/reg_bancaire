const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accountsController");

router.post("/", accountsController.createAccount);
router.get("/", accountsController.getAllAccounts);
router.get("/:id", accountsController.getAccountById);

router.patch("/:id/balance", async (req, res) => {
    const accountId = req.params.id;
    const { balanceChange } = req.body;

    if (!balanceChange) {
        return res.status(400).json({ message: "balanceChange est requis pour modifier le solde" });
    }

    const updated = await accountsController.updateBalance(accountId, balanceChange);

    if (updated) {
        res.status(200).json({ message: "Solde mis à jour avec succès" });
    } else {
        res.status(500).json({ message: "Erreur lors de la mise à jour du solde" });
    }
});


router.delete("/:id", accountsController.deleteAccount);

module.exports = router;
