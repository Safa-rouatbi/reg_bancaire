const db = require("../db");
const { getAccountById } = require("../services/accountAPI");

const resolvers = {
  Transaction: {
    user: async (parent) => {
      // parent.account_id provient de la transaction
      return await getAccountById(parent.account_id);
    },
  },

  Query: {
    transactions: (_, { accountId, type, startDate, endDate }) => {
      let query = "SELECT * FROM transaction_history WHERE 1=1";
      let params = [];

      if (accountId) {
        query += " AND account_id = ?";
        params.push(accountId);
      }

      if (type) {
        query += " AND type = ?";
        params.push(type);
      }

      if (startDate) {
        query += " AND timestamp >= ?";
        params.push(startDate);
      }

      if (endDate) {
        query += " AND timestamp <= ?";
        params.push(endDate);
      }

      return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
    },
  },

  Mutation: {
    addTransaction: (_, { account_id, type, amount }) => {
      return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO transaction_history (account_id, type, amount, timestamp) VALUES (?, ?, ?, NOW())";
        db.query(query, [account_id, type, amount], (err, result) => {
          if (err) return reject(err);

          const insertedId = result.insertId;
          db.query(
            "SELECT * FROM transaction_history WHERE transaction_id = ?",
            [insertedId],
            (err, results) => {
              if (err) return reject(err);
              resolve(results[0]);
            }
          );
        });
      });
    },
  },
};

module.exports = resolvers;
