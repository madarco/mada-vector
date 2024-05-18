import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || createPrisma()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma

function createPrisma() {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
  const adapter = new PrismaNeon(neon)
  const prisma = new PrismaClient({ adapter })

  return prisma
}