import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    console.log('Seed: No operations (moving to Clerk auth).')
}
main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { await prisma.$disconnect(); process.exit(1) })
