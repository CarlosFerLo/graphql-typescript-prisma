// npm i graphql-scalars
import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from "graphql-scalars";

export const GQLDate = asNexusMethod(GraphQLDateTime, "dateTime");
//                                   custom scalar   |   name 