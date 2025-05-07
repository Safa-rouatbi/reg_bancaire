const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Transaction {
    id: ID!
    user_id: Int!
    type: String!
    amount: Float!
    created_at: String!
  }

  type Query {
    getTransactionsByUser(user_id: Int!): [Transaction]
  }

  type Mutation {
    addTransaction(user_id: Int!, type: String!, amount: Float!): Transaction
  }
`;

module.exports = typeDefs;
