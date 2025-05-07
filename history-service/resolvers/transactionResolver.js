const db = require("../db");

const resolvers = {
  Query: {
    getTransactionsByUser: (_, { user_id }) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM transaction_history WHERE user_id = ?",
          [user_id],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });
    },
  },

  Mutation: {
    addTransaction: (_, { user_id, type, amount }) => {
      return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO transaction_history (user_id, type, amount, created_at) VALUES (?, ?, ?, NOW())";
        db.query(query, [user_id, type, amount], (err, result) => {
          if (err) return reject(err);

          const insertedId = result.insertId;
          db.query(
            "SELECT * FROM transaction_history WHERE id = ?",
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
