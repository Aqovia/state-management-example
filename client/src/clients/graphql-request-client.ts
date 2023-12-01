import { GraphQLClient } from "graphql-request";
import * as config from "../../config.json";

export const graphqlClient = new GraphQLClient(config.graphqlServerUrl);
