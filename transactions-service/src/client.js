const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { grpcPort } = require("./config");

const packageDefinition = protoLoader.loadSync("transactions.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const transactionProto = grpc.loadPackageDefinition(packageDefinition).transactions;

const client = new transactionProto.TransactionService(grpcPort, grpc.credentials.createInsecure());

const newTransaction = {
    id: "tx123",
    sender_account: 123,
    receiver_account: 456,
    amount: 500
};


client.CreateTransaction(newTransaction, (error, response) => {
    if (!error) {
        console.log("Transaction créée :", response);
    } else {
        console.error("Erreur :", error.message);
    }
});

// Tester la validation
client.ValidateTransaction({ transaction_id: "tx123" }, (error, response) => {
    if (!error) {
        console.log("Validation :", response);
    } else {
        console.error("Erreur :", error.message);
    }
});
