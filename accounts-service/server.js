const express = require("express");
const db = require("./db"); // Importation de la connexion à la base de données
const app = express();
const accountsRoutes = require("./routes/accounts"); // Importation des routes

app.use(express.json()); // Pour analyser les corps de requêtes JSON

// Utilisation des routes pour gérer les comptes
app.use("/accounts", accountsRoutes);

// Test de la connexion à la base de données
db.getConnection()
  .then(() => {
    console.log("Connexion à la base de données réussie!");

    // Démarrage du serveur seulement si la connexion est réussie
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données:", err);
    process.exit(1); // Quitte le processus si la connexion échoue
  });
