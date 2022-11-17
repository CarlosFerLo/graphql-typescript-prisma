// npm i bcryptjs jsonwebtoken
// npm i -D @types/bcryptjs  @types/jsonwebtoken

import { extendType, nonNull, objectType, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils/auth";

import { User } from "./User";
import { resolve } from "path";


export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("token") ;
        t.nonNull.field("user", { type: "User" });
    },
});

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("signup", {
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                pasword: nonNull(stringArg()),
                name: nonNull(stringArg()),
            },
            async resolve (parent, args, context, info) {
                const { email, name } = args;
                // hash users pasword
                const pasword = await bcrypt.hash(args.pasword, 10);
                // create new user
                const user = await context.prisma.user.create({
                    data: { email, name, pasword },
                });
                // generate JSON Web Token based on id of the user
                const token = jwt.sign({ userId: user.id }, APP_SECRET) ;

                return {
                    token,
                    user,
                } ;
            },
        }) ;
        t.nonNull.field("login", {
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                pasword: nonNull(stringArg()),
            },

            async resolve (parent, args, context, info) {
                // Look for user wuth that email
                const user = await context.prisma.user.findUnique({
                    where: { email: args.email },
                }) ;
                if (!user) {
                    throw new Error("No such user found") ;
                }
                // look if pasword is correct
                const valid = await bcrypt.compare(
                    args.pasword,
                    user.pasword
                );
                if (!valid) {
                    throw new Error("Invalid password") ;
                }
                // create JWT token
                const token = jwt.sign({ userId: user.id }, APP_SECRET) ;

                return {
                    token,
                    user,
                }
            }
        });
    },
})