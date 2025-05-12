const express = require("express");
const db = require("./db");
const app = express();
const accountsRoutes = require("./routes/accounts");

app.use(express.json()); 
app.use("/accounts", accountsRoutes);
db.getConnection()
  .then(() => {
    console.log("Connexion à la base de données réussie!");

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données:", err);
    process.exit(1); 
  });
