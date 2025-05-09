const { Kafka } = require("kafkajs");
const { kafkaBroker, kafkaTopic } = require("./config");

const kafka = new Kafka({ clientId: "transaction-service", brokers: [kafkaBroker] });
const producer = kafka.producer();

async function sendTransactionEvent(transaction) {
    try {
        await producer.connect();
        await producer.send({
            topic: kafkaTopic,
            messages: [{ value: JSON.stringify(transaction) }]
        });
        console.log("Événement Kafka envoyé :", transaction);
        await producer.disconnect();
    } catch (error) {
        console.error("Erreur lors de l’envoi à Kafka :", error.message);
    }
}

module.exports = sendTransactionEvent;
