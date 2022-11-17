import { extendType, objectType } from "nexus";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.string("pasword") ;
        t.list.nonNull.field("links", {    
            type: "Link",
            resolve(parent, args, context) {  
                return context.prisma.user 
                    .findUnique({ where: { id : parent.id } })
                    .links() ;
            },
        });
        t.nonNull.list.nonNull.field("votes", {
            type: "Link",
            resolve (parent, args, context, info) {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .votes();
            }
        })
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users", {
            type: "User",
            resolve(parent, args, context, info) {
                return context.prisma.user.findMany() ;
            }
        })
    },
})
