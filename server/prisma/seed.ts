import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function Seed() {
  const seed1 = await prisma.user.upsert({
    where: { email: 'testdata@gmail.com' },
    update: {},
    create: {
      email: 'testdata@gmail.com',
      name: 'test',
      posts: {
        create: {
          title: 'Tacos Gerecht',
          url: 'https://www.prisma.io/nextjs',
        },
      },
    },
  })
  console.log({ seed1 })
}
Seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })