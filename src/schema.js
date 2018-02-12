import { makeExecutableSchema } from "graphql-tools";

import { updateEntity, pushEntity, getEntity, fql } from "./firebase";

// http://dev.apollodata.com/tools/graphql-tools/resolvers.html
const resolvers = {
  Query: {
    async treeDocument(root, { id }, context) {
      return await getEntity(fql`treeDocuments/${id || 0}`);
    }
  }
};

const graphql = String.raw;

const schema = graphql`

  type TreeDocument {
    id: ID!
    title: String
  }

  type Query {
    treeDocument(id: ID): TreeDocument
  }
`;

export default makeExecutableSchema({ typeDefs: schema, resolvers });
