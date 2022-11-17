import { User } from "@prisma/client";
import { extendType, nonNull, objectType, stringArg, intArg, enumType, arg, inputObjectType, list} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { Prisma } from "@prisma/client";

export const Sort = enumType({
    name: "Sort",
    members: ["asc", "desc"],
});

export const LinkOrderedByInput = inputObjectType({
    name: "LinkOrderedByInput",
    definition(t) {
        t.field("description", { type: Sort });
        t.field("url", { type: Sort });
        t.field("createdAt", { type: Sort });
    },
})

export const Link = objectType({
    name: "Link",  // defines type name
    definition(t) { // here you can add fields to the type
        t.nonNull.int("id") ; 
        t.nonNull.string("description") ;
        t.nonNull.string("url") ;
        t.nonNull.dateTime("createdAt") ;
        t.field("postedBy", {
            type: "User",
            resolve(parent, args, context, info) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy() ;
            },
        });
        t.nonNull.list.nonNull.field("voters", {
            type: "User",
            resolve (parent, args, context, info) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .voters() ;
            }
        })
    },
}) ;

export const LinkQuery = extendType({ // Extend Query type
    type: "Query",
    definition(t) { 
        t.nonNull.field("feed", { // Define return type + name of the query
            type: "Feed",
            args: {
                filter: stringArg(),
                skip: intArg(),
                take: intArg(),
                orderBy: arg({ type: list(nonNull(LinkOrderedByInput))}),
            },
            async resolve(parent, args, context, info) { // resolver function
                const where = args.filter
                    ?   {
                            OR: [
                                { description: { contains: args.filter } },
                                { url: { contains: args.filter } }
                            ]
                        }
                    : {} ;
                const links = context.prisma.link.findMany({
                    where,
                    skip: args?.skip as number | undefined,
                    take: args?.take as number | undefined,
                    orderBy: args?.orderBy as 
                        Prisma.Enumerable<Prisma.LinkOrderByWithAggregationInput> 
                        | undefined,
                });

                const count = await context.prisma.link.count({ where });
                const id = `main-feed:${JSON.stringify(args)}`;

                return {
                    links,
                    count,
                    id,
                }
            },
        }),
        t.field("link", {
            type: "Link",
            args:{
                id: nonNull(intArg()),
            },

            resolve(parent, args, context, info) {
                const link = context.prisma.link.findUnique({
                    where: { id: args.id },
                });
                return link ;
            }
        })
    },
});

export const LinkMutation = extendType({ // extend mutation type
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", { // defined mutation 'post' and returna a non.nullable link objs
            type: "Link",
            args:{ // imputs
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },

            resolve(parent, args, context, info) {
                const { description, url } = args ;
                const { userId } = context ;

                if (!userId) {
                    throw new Error("Cannot post without loggin in.");
                }

                const newLink = context.prisma.link.create({
                    data: {
                        description,
                        url,
                        // asociar a un usuario
                        postedBy: { connect: { id: userId } }, 
                    }
                }) ;

                return newLink ;
            },
 
        }),
        t.nonNull.field("update", {
            type: "Link",
            args:{
                id: nonNull(intArg()),
                description: stringArg(),
                url: stringArg()
            },

            resolve(parent, args, context, info) {
                const { id, description, url} = args ;
                const link = context.prisma.link.update({
                    where: { id: Number(id) },
                    data: {
                        description: description || undefined,
                        url: url || undefined
                    }
                });
                return link ;
            }
        }),
        t.nonNull.field("deleteLink", {
            type: "Link",
            args: {
                id: nonNull(intArg())
            },

            resolve(parent, args, context, info) {
                const deleatedLink = context.prisma.link.delete({
                    where: { id: Number(args.id)}
                }) ;
                return deleatedLink ;
            }
        })
    },
});

export const Feed = objectType({
    name: "Feed",
    definition(t) {
        t.nonNull.list.nonNull.field("links", { type: Link });
        t.nonNull.int("count");
        t.id("id")
    },
})