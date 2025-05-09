function validateTransaction(transaction) {
    if (!transaction.id || !transaction.sender_account || !transaction.receiver_account) {
        return { valid: false, error: "Champs obligatoires manquants" };
    }
    if (transaction.amount <= 0) {
        return { valid: false, error: "Le montant doit être positif" };
    }
    return { valid: true };
}

module.exports = validateTransaction;
