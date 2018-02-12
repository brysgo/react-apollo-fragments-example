import { ApolloClient } from "apollo-client";
import { SchemaLink } from "apollo-link-schema";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { LoggingLink, addApolloLogging } from "apollo-logger";
import DebounceLink from 'apollo-link-debounce';

import { onError } from "apollo-link-error";

import { InMemoryCache } from "apollo-cache-inmemory";
import schema from "./schema";

const cache = new InMemoryCache();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      if (message.includes("PERMISSION_DENIED")) {
        cache.writeData({
          data: {
            loggedInStatus: {
              __typename: "LoggedInStatus",
              recieved401: true
            }
          }
        });
      }
    });
});

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      updateLoggedInStatus: (_, { isLoggedIn, recieved401 }, { cache }) => {
        const data = {
          loggedInStatus: {
            __typename: "LoggedInStatus",
            isLoggedIn,
            recieved401
          }
        };
        cache.writeData({ data });
        return null;
      }
    }
  },
  defaults: {
    loggedInStatus: {
      __typename: "LoggedInStatus",
      isLoggedIn: false,
      recieved401: false
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    stateLink,
    new DebounceLink(1000),
    new LoggingLink(),
    new SchemaLink({ schema })
  ]),
  cache
});

addApolloLogging({ publish: (...args) => console.log(args) });

client.onResetStore(stateLink.writeDefaults);

export default client;
