const express = require("express");
const validateTransaction = require("./validation");

const app = express();
app.use(express.json());

app.post("/authorize", (req, res) => {
    console.log("🔹 Requête reçue :", req.body);
    const transaction = req.body;
    const validation = validateTransaction(transaction);

    if (!validation.valid) {
        return res.status(400).json({ status: "Rejected", message: validation.error });
    }

    return res.status(200).json({ status: "Approved" });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Serveur d’autorisations REST démarré sur http://127.0.0.1:${PORT}`);
});


