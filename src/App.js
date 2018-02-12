import React from "react";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo-fragments";
import gql from "graphql-tag";
import { View, ActivityIndicator } from "react-native";
import TitleBar from "./TitleBar";
import client from "./apolloClient";

export default (Editor = () => {
  return (
    <ApolloProvider client={client}>
      <Query query={EDITOR_QUERY}>
        {({ data, error, loading }) => {
          if (error) {
            throw error;
          }
          const { treeDocument } = data;

          if (loading) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ActivityIndicator color="#ff6600" size="large" />
              </View>
            );
          } else {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#F5F5F5"
                }}
              >
                <TitleBar data={treeDocument} />
              </View>
            );
          }
        }}
      </Query>
    </ApolloProvider>
  );
});

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// TODO: Should not have to include fragment here
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
const EDITOR_QUERY = gql`
  query EditorQuery {
    treeDocument {
      ...TitleBar
    }
  }

  ${TitleBar.fragments.data}
`;
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
