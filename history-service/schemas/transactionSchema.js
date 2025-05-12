const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Account {
    id: ID!
    name: String
    email: String
  }

  type Transaction {
    transaction_id: ID!
    account_id: Int!
    amount: Float!
    type: String!
    timestamp: String!
    user: Account
  }

  type Query {
    transactions(
      accountId: Int
      type: String
      startDate: String
      endDate: String
    ): [Transaction]
  }

  type Mutation {
    addTransaction(account_id: Int!, type: String!, amount: Float!): Transaction
  }
`;

module.exports = typeDefs;
