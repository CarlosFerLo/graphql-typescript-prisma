import { ApolloServer } from "apollo-server";
import { context } from "./context";

import { schema } from "./schema"; // import graphQL schema definde using nexus
export const server = new ApolloServer({
    schema,
    context,
}) ;

const port = 3000 ;
// Start the server and specify port
server.listen({port}).then(({url}) => {
    console.log(`Server ready at ${url}`) ;
}) ;