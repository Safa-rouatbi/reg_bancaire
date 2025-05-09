const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const validateTransaction = require("./validation");
const sendTransactionEvent = require("./kafka-producer");
const { grpcPort } = require("./config");

const axios = require("axios");
const { authServiceUrl } = require("./config");

const ACCOUNT_SERVICE_BASE_URL = "http://localhost:3000"; 
const HISTORY_SERVICE_URL = "http://localhost:4000/graphql"; 

const packageDefinition = protoLoader.loadSync("../transactions.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const transactionProto = grpc.loadPackageDefinition(packageDefinition).transactions;

const transactionsDB = {};
const server = new grpc.Server();
async function isAccountValid(accountId) {
    try {
        const response = await axios.get(`${ACCOUNT_SERVICE_BASE_URL}/accounts/${accountId}`);
        return response.status === 200;
    } catch (error) {
        console.error(`Erreur de validation du compte ${accountId} :`, error.message);
        return false;
    }
}
async function checkBalance(accountId, amount) {
    try {
        const response = await axios.get(`${ACCOUNT_SERVICE_BASE_URL}/accounts/${accountId}`);
        const currentBalance = response.data.balance;
        
        return currentBalance >= amount;
    } catch (error) {
        console.error(`Erreur de récupération du solde pour ${accountId} :`, error.message);
        return false;
    }
}

async function updateBalances(transaction) {
    try {
      const isBalanceValid = await checkBalance(transaction.sender_account, transaction.amount);
      if (!isBalanceValid) {
        console.error("❌ Solde insuffisant pour effectuer la transaction !");
        return false;
      }
  
      console.log("🔹 Mise à jour du solde pour le sender...");
      await axios.patch(`${ACCOUNT_SERVICE_BASE_URL}/accounts/${transaction.sender_account}/balance`, {
        balanceChange: transaction.amount * -1 
    });
    console.log("✅ Requête envoyée avec succès !");
    
  
      console.log("🔹 Mise à jour du solde pour le receiver...");
      await axios.patch(`${ACCOUNT_SERVICE_BASE_URL}/accounts/${transaction.receiver_account}/balance`, {
        balanceChange: transaction.amount 
      });
  
      console.log("✅ Soldes mis à jour avec succès !");
      return true;
    } catch (error) {
      console.error("❌ Erreur de mise à jour des soldes :", error.message);
      return false;
    }
  }
  

async function saveTransactionHistory(transaction) {
    try {
        const mutationQuery = `
            mutation {
                addTransaction(account_id: ${transaction.sender_account}, type: "Debit", amount: ${transaction.amount}) {
                    transaction_id
                    account_id
                    amount
                    type
                    timestamp
                }
            }
        `;

        await axios.post(HISTORY_SERVICE_URL, { query: mutationQuery });
        console.log("Transaction enregistrée dans l'historique !");
    } catch (error) {
        console.error("Erreur d’enregistrement dans l’historique :", error.message);
    }
}
async function validateWithAuthorizationService(transaction) {
    try {
        const response = await axios.post(authServiceUrl, transaction);
        return response.data;
    } catch (error) {
        console.error("Erreur d'appel REST à Autorisations :", error.response ? error.response.data : error.message);
        
        if (error.response && error.response.status === 400) {
            return { status: "Rejected", message: error.response.data.message };
        }

        return { status: "Error", message: "Service d'autorisation indisponible" };
    }
}
server.addService(transactionProto.TransactionService.service, {
    CreateTransaction: async (call, callback) => {
        const transaction = call.request;

        const isSenderValid = await isAccountValid(transaction.sender_account);
        const isReceiverValid = await isAccountValid(transaction.receiver_account);

        if (!isSenderValid || !isReceiverValid) {
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: "Compte expéditeur ou destinataire invalide"
            }, null);
        }

        const authResponse = await validateWithAuthorizationService(transaction);
        if (authResponse.status !== "Approved") {
            console.error("Transaction refusée :", authResponse.message);
            return callback({
                code: grpc.status.PERMISSION_DENIED,
                message: `Transaction refusée : ${authResponse.message}`
            }, null);
        }
        const validation = validateTransaction(transaction);
        if (!validation.valid) {
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: validation.error
            }, null);
        }

        transactionsDB[transaction.id] = transaction;
        console.log("Transaction validée et enregistrée :", transaction);

        await updateBalances(transaction);
        await sendTransactionEvent(transaction);
        await saveTransactionHistory(transaction);

        callback(null, { status: "Success", transaction_id: transaction.id });
    },

    ValidateTransaction: async (call, callback) => {
        const transactionId = call.request.transaction_id;

        if (!transactionsDB[transactionId]) {
            console.log(`❌ Validation échouée : Transaction ${transactionId} introuvable`);
            return callback(null, { status: "Failed" });
        }

        console.log(`✅ Validation réussie : Transaction ${transactionId} existe`);
        return callback(null, { status: "Success" });
    }
});

server.bindAsync(grpcPort, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`🚀 Serveur gRPC démarré sur ${grpcPort}`);
});
