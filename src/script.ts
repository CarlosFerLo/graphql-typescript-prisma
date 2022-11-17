import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient() ;

async function main () { // send queries to database
    // create a new link
    const newLink = await prisma.link.create({
        data: {
            description: 'Fullstack tutorial dor GraphQl',
            url: 'www.howtographql.com',
        },
    }) ;
    // query all links
    const allLinks = await prisma.link.findMany() ;
    console.log(allLinks) ;
}

main ()
    .catch ((e) => {
        throw e ;
    })
    .finally(async () => {
        await prisma.$disconnect() ; // close database connection 
    }) ;