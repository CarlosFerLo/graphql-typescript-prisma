import { makeSchema } from "nexus";
import { join } from "path";
import { isJSDocParameterTag } from "typescript";
import * as types from "./graphql" ; // import graphql types

export const schema = makeSchema({
    types, // Types passed as an array
    outputs: {
        schema: join(process.cwd(), "schema.graphql"), // Generates schema.graphql file with grapQL types
        typegen: join(process.cwd(), "nexus-typegen.ts"), // Generates typescript types
    },
    contextType: {
        module: join(process.cwd(), "./src/context.ts"), // Import interface
        export: "Context", // Name interface
    } ,
}) ;
