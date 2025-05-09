function notifyUser(transaction) {
    console.log(` Notification envoyée : Transaction ${transaction.id} pour ${transaction.receiver_account}, montant : ${transaction.amount}`);
}

module.exports = notifyUser;
