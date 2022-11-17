import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";
import { Request } from "express";

export const prisma = new PrismaClient() ;

export interface Context { // what objects will be attached to the context object
    prisma: PrismaClient;
    userId?: number; 
}
// Exprot to use it on graphQL server
export const context = ({ req }: { req: Request }): Context => {
    const token =
        req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null ;

    return {
        prisma,
        userId: token?.userId,
    }
};