import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

async function Seed() {

  const category1 = await prisma.category.create({
    data: {
      title: 'Lunch',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      title: 'Breakfast',
    },
  });

  // Seed some test data 
  const user1 = await prisma.user.upsert({
    where: { email: 'test@gmail.com' },
    update: {},
    create: {
      name: 'Test',
      email: 'test@gmail.com',
      username: 'Test',
      avatar: 'https://cdn.pixabay.com/photo/2015/02/13/00/43/apples-634572_1280.jpg',
      googleId: '1234567890',
      posts: {
        create: [{
          title: 'Tacos Gerecht',
          url: 'https://www.prisma.io/nextjs',
          image: 'https://cdn.pixabay.com/photo/2015/02/13/00/43/apples-634572_1280.jpg',
          categories: {
            connect: [{ id: category1.id }, { id: category2.id }],
          },
          createdAt: new Date(),
        }],
    },
    },
  });
}

Seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
