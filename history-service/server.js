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
    db.getConnection((err, connection) => {
      if (err) {
        console.error(
          "Erreur de connexion à la base de données :",
          err.message
        );
        process.exit(1);
      } else {
        console.log("Connexion à la base de données réussie.");
        connection.release();

        server.start().then(() => {
          server.applyMiddleware({ app });

          const PORT = 4000;
          app.listen(PORT, () => {
            console.log(
              `Serveur GraphQL lancé sur http://localhost:${PORT}${server.graphqlPath}`
            );
          });
        });
      }
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur GraphQL :", error);
  }
}

startServer();
