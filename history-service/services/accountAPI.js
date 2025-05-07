const axios = require("axios");

const ACCOUNT_SERVICE_BASE_URL = "http://localhost:3000"; // Port du service REST

const getAccountById = async (id) => {
  try {
    const response = await axios.get(
      `${ACCOUNT_SERVICE_BASE_URL}/accounts/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API REST :", error.message);
    return null;
  }
};

module.exports = {
  getAccountById,
};
