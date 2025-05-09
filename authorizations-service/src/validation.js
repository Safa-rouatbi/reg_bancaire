function validateTransaction(transaction) {
    if (!transaction.sender_account || !transaction.receiver_account) {
        return { valid: false, error: "Compte expéditeur ou destinataire manquant" };
    }

    if (transaction.amount <= 0) {
        return { valid: false, error: "Montant de la transaction invalide" };
    }

    if (transaction.amount > 10000) {
        return { valid: false, error: "Montant de la transaction dépasse la limite autorisée" };
    }

    return { valid: true };
}

module.exports = validateTransaction;
