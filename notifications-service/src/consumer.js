const { Kafka } = require("kafkajs");
const { kafkaBroker, kafkaTopic } = require("./config");
const notifyUser = require("./notifier");

const kafka = new Kafka({ clientId: "notifications-service", brokers: [kafkaBroker] });
const consumer = kafka.consumer({ groupId: "notifications-group" });

async function consumeTransactionEvents() {
    await consumer.connect();
    await consumer.subscribe({ topic: kafkaTopic, fromBeginning: true });

    console.log("📢 Consumer Kafka en attente d'événements...");

    await consumer.run({
        eachMessage: async ({ message }) => {
            const transaction = JSON.parse(message.value.toString());
            console.log("Nouvelle transaction reçue :", transaction);
            notifyUser(transaction);
        }
    });
}

consumeTransactionEvents().catch(console.error);

