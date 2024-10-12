const { gql } = require('graphql-tag');

// Define the GraphQL schema
const typeDefs = gql`
  type TestResult {
    test_name: String
    test_outcome: String
    test_execution_date: String
    test_environment: String
    error_message: String
    test_category: String
    test_case_id: String
  }

  type Query {
    testResults: [TestResult]
    testResult(test_case_id: String!): TestResult
    filterTestResults(
      test_name: String,
      test_outcome: String,
      test_execution_date: String,
      test_environment: String,
      error_message: String,
      test_category: String,
      test_case_id: String
    ): [TestResult]
  }
`;

// Define the resolvers
const resolvers = {
    Query: {
        testResults: async (_, __, { dataSources }) => {
            return await dataSources.testResultsAPI.getAllTestResults();
        },
        testResult: async (_, { test_case_id }, { dataSources }) => {
            return await dataSources.testResultsAPI.getTestResultById(test_case_id);
        },
        filterTestResults: async (_, args, { dataSources }) => {
            return await dataSources.testResultsAPI.filterTestResults(args);
        },
    },
};

module.exports = { typeDefs, resolvers };
