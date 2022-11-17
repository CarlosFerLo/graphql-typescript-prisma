import * as jwt from "jsonwebtoken" ;

export const APP_SECRET = "GraphQL-is-aw3some"; // long secret and random

// format of decoded token
export interface AuthTokenPayload {
    userId: number ;
}

// Parsw Authorisation header and parses it
export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
    const token = authHeader.replace("Bearer ", ""); // Remove authorisation scheme

    if (!token) {
        throw new Error("No token found");
    }
    // Decode token
    return jwt.verify(token, APP_SECRET) as AuthTokenPayload ;
}
