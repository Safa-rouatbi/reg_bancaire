const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schemas/transactionSchema");
const resolvers = require("./resolvers/transactionResolver");
const db = require("./db");

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    const connection = await db.getConnection().catch((err) => {
        console.error("Erreur de connexion à la base de données :", err.message);
        return null;
    });

    if (connection) {
        console.log("Connexion à la base de données réussie.");
        connection.release();
    } else {
        console.warn("La base de données n'est pas disponible, mais le serveur GraphQL démarre quand même.");
    }

    await server.start();
    server.applyMiddleware({ app });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Serveur GraphQL opérationnel sur http://localhost:${PORT}${server.graphqlPath}`);
    });

  } catch (error) {
    console.error("Erreur critique lors du démarrage du serveur GraphQL :", error);
  }
}


startServer();
